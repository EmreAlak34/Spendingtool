
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

    private ExpenseDTO testExpenseFood;
    private ExpenseDTO testExpenseTravel;

    @BeforeEach
    void setUp() {
        expenseRepository.deleteAll();
        testExpenseFood = new ExpenseDTO(null, "Groceries", 50.0, "Food");
        testExpenseTravel = new ExpenseDTO(null, "Flight Ticket", 200.0, "Travel");
    }

    @AfterEach
    void tearDown() {
        expenseRepository.deleteAll();
    }

    @Test
    void shouldSaveExpense() throws Exception {
        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testExpenseFood)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.description").value("Groceries"))
                .andExpect(jsonPath("$.amount").value(50.0))
                .andExpect(jsonPath("$.category").value("Food"));
    }

    @Test
    void shouldGetAllExpenses() throws Exception {
        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testExpenseFood)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/expenses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].description").value("Groceries"))
                .andExpect(jsonPath("$[0].amount").value(50.0))
                .andExpect(jsonPath("$[0].category").value("Food"));
    }

    @Test
    void shouldGetExpenseById() throws Exception {
        String response = mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testExpenseFood)))
                .andReturn().getResponse().getContentAsString();

        ExpenseDTO savedExpense = objectMapper.readValue(response, ExpenseDTO.class);

        mockMvc.perform(get("/api/expenses/" + savedExpense.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedExpense.getId()))
                .andExpect(jsonPath("$.description").value("Groceries"))
                .andExpect(jsonPath("$.amount").value(50.0))
                .andExpect(jsonPath("$.category").value("Food"));
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
                        .content(objectMapper.writeValueAsString(testExpenseFood)))
                .andReturn().getResponse().getContentAsString();

        ExpenseDTO savedExpense = objectMapper.readValue(response, ExpenseDTO.class);

        ExpenseDTO updatedExpense = new ExpenseDTO(savedExpense.getId(), "Updated Description", 75.0, "Food");

        mockMvc.perform(put("/api/expenses/" + savedExpense.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedExpense)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Updated Description"))
                .andExpect(jsonPath("$.amount").value(75.0))
                .andExpect(jsonPath("$.category").value("Food"));
    }

    @Test
    void shouldReturnNotFoundWhenUpdatingNonexistentExpense() throws Exception {
        ExpenseDTO updatedExpense = new ExpenseDTO("nonexistent-id", "Updated", 100.0, "Other");

        mockMvc.perform(put("/api/expenses/nonexistent-id")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedExpense)))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldDeleteExpense() throws Exception {
        String response = mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testExpenseFood)))
                .andReturn().getResponse().getContentAsString();

        ExpenseDTO savedExpense = objectMapper.readValue(response, ExpenseDTO.class);

        mockMvc.perform(delete("/api/expenses/" + savedExpense.getId()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/expenses/" + savedExpense.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldReturnNotFoundWhenDeletingNonexistentExpense() throws Exception {
        mockMvc.perform(delete("/api/expenses/nonexistent-id"))
                .andExpect(status().isNotFound());
    }


    @Test
    void shouldGetDistinctCategories() throws Exception {

        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testExpenseFood)))
                .andExpect(status().isOk());
        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testExpenseTravel)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/expenses/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[?(@=='Food')]").exists())
                .andExpect(jsonPath("$[?(@=='Travel')]").exists());
    }
}
