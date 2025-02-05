package org.example.backend.controller;

import org.example.backend.dto.ExpenseDTO;
import org.example.backend.repository.ExpenseRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDate;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ExpenseControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private ExpenseDTO testExpense;

    @BeforeEach
    void setUp() {
        expenseRepository.deleteAll();
        testExpense = new ExpenseDTO(null, "Groceries", 50.0, "Food", LocalDate.now());

    }

    @AfterEach
    void tearDown() {
        expenseRepository.deleteAll();
    }

    @Test
    void shouldSaveExpense() throws Exception {
        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testExpense)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.description").value("Groceries"))
                .andExpect(jsonPath("$.amount").value(50.0))
                .andExpect(jsonPath("$.category").value("Food"))
                .andExpect(jsonPath("$.createdAt").exists());
    }

    @Test
    void shouldGetAllExpenses() throws Exception {
        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testExpense)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/expenses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].description").value("Groceries"))
                .andExpect(jsonPath("$[0].amount").value(50.0))
                .andExpect(jsonPath("$[0].category").value("Food"))
                .andExpect(jsonPath("$[0].createdAt").exists());
    }

    @Test
    void shouldGetExpenseById() throws Exception {
        String response = mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testExpense)))
                .andReturn().getResponse().getContentAsString();

        ExpenseDTO savedExpense = objectMapper.readValue(response, ExpenseDTO.class);

        mockMvc.perform(get("/api/expenses/" + savedExpense.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedExpense.getId()))
                .andExpect(jsonPath("$.description").value("Groceries"))
                .andExpect(jsonPath("$.amount").value(50.0))
                .andExpect(jsonPath("$.category").value("Food"))
                .andExpect(jsonPath("$.createdAt").exists());
    }

    @Test
    void shouldReturnNotFoundForNonExistingExpense() throws Exception {
        mockMvc.perform(get("/api/expenses/nonexistent-id"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldUpdateExpense() throws Exception {
        String response = mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testExpense)))
                .andReturn().getResponse().getContentAsString();

        ExpenseDTO savedExpense = objectMapper.readValue(response, ExpenseDTO.class);

        ExpenseDTO updatedExpense = new ExpenseDTO(savedExpense.getId(), "Updated Description", 75.0, "Updated Category", LocalDate.now());


        mockMvc.perform(put("/api/expenses/" + savedExpense.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedExpense)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Updated Description"))
                .andExpect(jsonPath("$.amount").value(75.0))
                .andExpect(jsonPath("$.category").value("Updated Category"))
                .andExpect(jsonPath("$.createdAt").exists());
    }

    @Test
    void shouldReturnNotFoundWhenUpdatingNonexistentExpense() throws Exception {
        ExpenseDTO updatedExpense = new ExpenseDTO("nonexistent-id", "Updated", 100.0, "Other", LocalDate.now());


        mockMvc.perform(put("/api/expenses/nonexistent-id")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedExpense)))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldDeleteExpense() throws Exception {
        String response = mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testExpense)))
                .andReturn().getResponse().getContentAsString();

        ExpenseDTO savedExpense = objectMapper.readValue(response, ExpenseDTO.class);

        mockMvc.perform(delete("/api/expenses/" + savedExpense.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/expenses/" + savedExpense.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldReturnNotFoundWhenDeletingNonexistentExpense() throws Exception {
        mockMvc.perform(delete("/api/expenses/nonexistent-id"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldGetExpensesByCategory() throws Exception {

        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testExpense)))
                .andExpect(status().isOk());


        mockMvc.perform(get("/api/expenses/category/Food")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].description").value("Groceries"))
                .andExpect(jsonPath("$[0].amount").value(50.0))
                .andExpect(jsonPath("$[0].category").value("Food"))
                .andExpect(jsonPath("$[0].createdAt").exists());
    }

    @Test
    void shouldReturnEmptyListForNonExistingCategory() throws Exception {
        mockMvc.perform(get("/api/expenses/category/NonExistingCategory")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }
}