package org.example.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backend.dto.CategoryDTO;
import org.example.backend.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;


import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CategoryControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        categoryRepository.deleteAll();
    }


    @Test
    void shouldCreateCategory() throws Exception {
        CategoryDTO newCategory = new CategoryDTO(null, "Test Category");

        MvcResult result = mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newCategory)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Test Category"))
                .andReturn();

        String content = result.getResponse().getContentAsString();
        CategoryDTO createdCategory = objectMapper.readValue(content, CategoryDTO.class);
        assertNotNull(createdCategory.getId());
        assertFalse(createdCategory.getId().isEmpty());
    }

    @Test
    void createCategory_shouldReturnBadRequestIfNameExists() throws Exception {
        CategoryDTO newCategory = new CategoryDTO(null, "Test Category");
        mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newCategory)))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newCategory)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldGetAllCategories() throws Exception {
        CategoryDTO category1 = new CategoryDTO(null, "Category 1");
        CategoryDTO category2 = new CategoryDTO(null, "Category 2");
        mockMvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(category1)));
        mockMvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(category2)));

        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Category 1"))
                .andExpect(jsonPath("$[1].name").value("Category 2"));
    }

    @Test
    void shouldUpdateCategory() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CategoryDTO(null, "Original Name"))))
                .andExpect(status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        CategoryDTO createdCategory = objectMapper.readValue(content, CategoryDTO.class);
        String categoryId = createdCategory.getId();

        CategoryDTO updatedCategory = new CategoryDTO(categoryId, "New Name");

        mockMvc.perform(put("/api/categories/" + categoryId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedCategory)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(categoryId))
                .andExpect(jsonPath("$.name").value("New Name"));
    }

    @Test
    void shouldDeleteCategory() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CategoryDTO(null, "Category to Delete"))))
                .andExpect(status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        CategoryDTO createdCategory = objectMapper.readValue(content, CategoryDTO.class);
        String categoryId = createdCategory.getId();

        mockMvc.perform(delete("/api/categories/" + categoryId))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/categories/" + categoryId))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateCategory_shouldReturnNotFound_whenCategoryDoesNotExist() throws Exception {
        mockMvc.perform(put("/api/categories/nonExistentId")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CategoryDTO(null, "Updated Name"))))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteCategory_shouldReturnNotFound_whenCategoryDoesNotExist() throws Exception {
        mockMvc.perform(delete("/api/categories/nonExistentId"))
                .andExpect(status().isNotFound());
    }
    @Test
    void getCategoryById_shouldReturnCategory() throws Exception{
        MvcResult result = mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CategoryDTO(null, "Category To Get"))))
                .andExpect(status().isOk())
                .andReturn();
        String content = result.getResponse().getContentAsString();
        CategoryDTO createdCategory = objectMapper.readValue(content, CategoryDTO.class);
        String categoryId = createdCategory.getId();

        mockMvc.perform(get("/api/categories/" + categoryId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(categoryId))
                .andExpect(jsonPath("$.name").value("Category To Get"));
    }

    @Test
    void getCategoryById_shouldReturnNotFound_whenCategoryDoesNotExist() throws Exception{
        mockMvc.perform(get("/api/categories/nonExistentId"))
                .andExpect(status().isNotFound());
    }
}