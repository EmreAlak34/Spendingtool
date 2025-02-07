package org.example.backend.service;

import org.example.backend.dto.CategoryDTO;
import org.example.backend.exception.CategoryNotFoundException;
import org.example.backend.model.Category;
import org.example.backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        if (categoryRepository.findByName(categoryDTO.getName()).isPresent()) {
            throw new IllegalArgumentException("Category with name '" + categoryDTO.getName() + "' already exists.");
        }
        Category category = new Category(null, categoryDTO.getName());
        Category savedCategory = categoryRepository.save(category);
        return convertToDTO(savedCategory);
    }

    public CategoryDTO updateCategory(String id, CategoryDTO updatedCategoryDTO) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with id: " + id));

        Optional<Category> categoryWithName = categoryRepository.findByName(updatedCategoryDTO.getName());
        if (categoryWithName.isPresent() && !categoryWithName.get().getId().equals(id)) {
            throw new IllegalArgumentException("Another category with name '" + updatedCategoryDTO.getName() + "' already exists.");
        }

        category.setName(updatedCategoryDTO.getName());
        Category savedCategory = categoryRepository.save(category);
        return convertToDTO(savedCategory);
    }
    public Optional<CategoryDTO> getCategoryById(String id) {
        return categoryRepository.findById(id).map(this::convertToDTO);
    }

    public void deleteCategory(String id) {

        if (!categoryRepository.existsById(id)) {
            throw new CategoryNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        return dto;
    }
}