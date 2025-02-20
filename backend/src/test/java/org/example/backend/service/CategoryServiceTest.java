package org.example.backend.service;

import org.example.backend.dto.CategoryDTO;
import org.example.backend.exception.CategoryNotFoundException;
import org.example.backend.model.Category;
import org.example.backend.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    @Test
    void getAllCategories_shouldReturnCategoryDTOList() {
        List<Category> categories = Arrays.asList(
                new Category("1", "Groceries"),
                new Category("2", "Utilities")
        );
        when(categoryRepository.findAll()).thenReturn(categories);

        List<CategoryDTO> result = categoryService.getAllCategories();

        assertEquals(2, result.size());
        assertEquals("Groceries", result.get(0).getName());
        assertEquals("Utilities", result.get(1).getName());
        verify(categoryRepository).findAll();
    }

    @Test
    void createCategory_shouldCreateAndReturnNewCategory() {
        CategoryDTO newCategoryDTO = new CategoryDTO(null, "Electronics");
        Category savedCategory = new Category("3", "Electronics");
        when(categoryRepository.findByName("Electronics")).thenReturn(Optional.empty());
        when(categoryRepository.save(any(Category.class))).thenReturn(savedCategory);

        CategoryDTO result = categoryService.createCategory(newCategoryDTO);

        assertNotNull(result);
        assertEquals("Electronics", result.getName());
        assertEquals("3", result.getId());
        verify(categoryRepository).findByName("Electronics");
        verify(categoryRepository).save(any(Category.class));
    }

    @Test
    void createCategory_shouldThrowExceptionIfCategoryExists() {
        CategoryDTO existingCategoryDTO = new CategoryDTO(null, "Groceries");
        when(categoryRepository.findByName("Groceries")).thenReturn(Optional.of(new Category()));

        assertThrows(IllegalArgumentException.class, () -> {
            categoryService.createCategory(existingCategoryDTO);
        });
        verify(categoryRepository).findByName("Groceries");
        verify(categoryRepository, never()).save(any(Category.class));
    }
    @Test
    void updateCategory_shouldUpdateAndReturnCategory() {
        CategoryDTO updatedCategoryDTO = new CategoryDTO("1", "Updated Groceries");
        Category existingCategory = new Category("1", "Groceries");
        Category updatedCategory = new Category("1", "Updated Groceries");

        when(categoryRepository.findById("1")).thenReturn(Optional.of(existingCategory));
        when(categoryRepository.findByName("Updated Groceries")).thenReturn(Optional.empty());
        when(categoryRepository.save(any(Category.class))).thenReturn(updatedCategory);

        CategoryDTO result = categoryService.updateCategory("1", updatedCategoryDTO);

        assertNotNull(result);
        assertEquals("Updated Groceries", result.getName());
        assertEquals("1", result.getId());
        verify(categoryRepository).findById("1");
        verify(categoryRepository).findByName("Updated Groceries");
        verify(categoryRepository).save(any(Category.class));
    }

    @Test
    void updateCategory_shouldThrowExceptionIfCategoryNotFound() {
        CategoryDTO updatedCategoryDTO = new CategoryDTO("2", "Updated Groceries");
        when(categoryRepository.findById("2")).thenReturn(Optional.empty());

        assertThrows(CategoryNotFoundException.class, () -> {
            categoryService.updateCategory("2", updatedCategoryDTO);
        });
        verify(categoryRepository).findById("2");
        verify(categoryRepository, never()).save(any(Category.class));
    }
    @Test
    void updateCategory_shouldThrowExceptionIfNewNameExists() {
        CategoryDTO updatedCategoryDTO = new CategoryDTO("1", "ExistingCategory");
        Category existingCategory = new Category("1", "Groceries");
        Category anotherExistingCategory = new Category("2", "ExistingCategory");
        when(categoryRepository.findById("1")).thenReturn(Optional.of(existingCategory));
        when(categoryRepository.findByName("ExistingCategory")).thenReturn(Optional.of(anotherExistingCategory));
        assertThrows(IllegalArgumentException.class, () -> {
            categoryService.updateCategory("1", updatedCategoryDTO);
        });
        verify(categoryRepository).findById("1");
        verify(categoryRepository).findByName("ExistingCategory");
        verify(categoryRepository, never()).save(any(Category.class));
    }

    @Test
    void deleteCategory_shouldDeleteCategory() {
        when(categoryRepository.existsById("1")).thenReturn(true);
        doNothing().when(categoryRepository).deleteById(anyString());
        assertDoesNotThrow(() -> categoryService.deleteCategory("1"));
        verify(categoryRepository).existsById("1");
        verify(categoryRepository).deleteById("1");
    }

    @Test
    void deleteCategory_shouldThrowExceptionIfCategoryNotFound() {
        when(categoryRepository.existsById("2")).thenReturn(false);
        assertThrows(CategoryNotFoundException.class, () -> {
            categoryService.deleteCategory("2");
        });
        verify(categoryRepository).existsById("2");
        verify(categoryRepository, never()).deleteById(anyString());
    }
    @Test
    void getCategoryById_shouldReturnCategoryDTO() {
        Category existingCategory = new Category("1", "Groceries");
        when(categoryRepository.findById("1")).thenReturn(Optional.of(existingCategory));
        Optional<CategoryDTO> result = categoryService.getCategoryById("1");
        assertTrue(result.isPresent());
        assertEquals("Groceries", result.get().getName());
        verify(categoryRepository).findById("1");
    }

    @Test
    void getCategoryById_shouldReturnEmptyOptionalIfNotFound() {
        when(categoryRepository.findById("2")).thenReturn(Optional.empty());
        Optional<CategoryDTO> result = categoryService.getCategoryById("2");
        assertFalse(result.isPresent());
        verify(categoryRepository).findById("2");
    }
}