package org.example.backend.controller;

import org.example.backend.model.Expense;
import org.example.backend.repository.ExpenseRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.AutoConfigureDataMongo;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureDataMongo
public class ExpenseControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ExpenseRepository expenseRepository;

    @AfterEach
    void tearDown() {
        expenseRepository.deleteAll();
    }



    @Test
    void shouldSaveExpense() throws Exception {
        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"description\":\"Groceries\",\"amount\":50.0,\"category\":\"Food\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Groceries"))
                .andExpect(jsonPath("$.amount").value(50.0))
                .andExpect(jsonPath("$.category").value("Food"));
    }

    @Test
    void shouldGetAllExpenses() throws Exception {
        Expense expense = new Expense("Groceries", 50.0, "Food");
        expenseRepository.save(expense);

        mockMvc.perform(get("/api/expenses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].description").value("Groceries"))
                .andExpect(jsonPath("$[0].amount").value(50.0))
                .andExpect(jsonPath("$[0].category").value("Food"));
    }

    @Test
    void shouldGetExpenseById() throws Exception {
        Expense expense = new Expense("Groceries", 50.0, "Food");
        Expense savedExpense = expenseRepository.save(expense);

        mockMvc.perform(get("/api/expenses/" + savedExpense.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Groceries"))
                .andExpect(jsonPath("$.amount").value(50.0))
                .andExpect(jsonPath("$.category").value("Food"));
    }

    @Test
    void shouldReturnNotFoundWhenExpenseDoesNotExist() throws Exception {
        mockMvc.perform(get("/api/expenses/nonexistent-id"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Expense not found with id: nonexistent-id"));
    }

    @Test
    void shouldUpdateExpense() throws Exception {
        Expense expense = new Expense("Groceries", 50.0, "Food");
        Expense savedExpense = expenseRepository.save(expense);

        mockMvc.perform(put("/api/expenses/" + savedExpense.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"description\":\"Restaurant\",\"amount\":75.0,\"category\":\"Food\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Restaurant"))
                .andExpect(jsonPath("$.amount").value(75.0))
                .andExpect(jsonPath("$.category").value("Food"));
    }

    @Test
    void shouldReturnNotFoundWhenUpdatingNonexistentExpense() throws Exception {
        mockMvc.perform(put("/api/expenses/nonexistent-id")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"description\":\"Restaurant\",\"amount\":75.0,\"category\":\"Food\"}"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Expense not found with id: nonexistent-id"));
    }

    @Test
    void shouldDeleteExpense() throws Exception {
        Expense expense = new Expense("Groceries", 50.0, "Food");
        Expense savedExpense = expenseRepository.save(expense);

        mockMvc.perform(delete("/api/expenses/" + savedExpense.getId()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/expenses/" + savedExpense.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldReturnNotFoundWhenDeletingNonexistentExpense() throws Exception {
        mockMvc.perform(delete("/api/expenses/nonexistent-id"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Expense not found with id: nonexistent-id"));
    }
}