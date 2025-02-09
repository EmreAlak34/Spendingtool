package org.example.backend.service;

import org.example.backend.dto.ExpenseDTO;
import org.example.backend.exception.ExpenseNotFoundException;
import org.example.backend.model.Expense;
import org.example.backend.repository.ExpenseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @InjectMocks
    private ExpenseService expenseService;

    private Expense expense;
    private ExpenseDTO expenseDTO;

    @BeforeEach
    void setUp() {
        expense = new Expense();
        expense.setId("1");
        expense.setDescription("Groceries");
        expense.setAmount(50.0);
        expense.setCategory("Food");
        expense.setDate(LocalDate.now());

        expenseDTO = ExpenseDTO.builder()
                .id("1")
                .description("Groceries")
                .amount(50.0)
                .category("Food")
                .date(LocalDate.now())
                .build();
    }

    @Test
    void testGetAllExpenses() {
        List<Expense> expenses = new ArrayList<>();
        expenses.add(expense);
        when(expenseRepository.findAll()).thenReturn(expenses);

        List<ExpenseDTO> result = expenseService.getAllExpenses();
        assertEquals(1, result.size());
        assertEquals("Groceries", result.getFirst().getDescription());
    }

    @Test
    void testCreateExpense() {
        when(expenseRepository.save(any(Expense.class))).thenReturn(expense);
        ExpenseDTO result = expenseService.createExpense(expenseDTO);
        assertNotNull(result);
        assertEquals("Groceries", result.getDescription());
        assertNotNull(result.getDate());
    }

    @Test
    void testGetExpenseByIdFound() {
        when(expenseRepository.findById("1")).thenReturn(Optional.of(expense));
        Optional<ExpenseDTO> result = expenseService.getExpenseById("1");
        assertTrue(result.isPresent());
        assertEquals("Groceries", result.get().getDescription());
    }

    @Test
    void testGetExpenseByIdNotFound() {
        when(expenseRepository.findById("2")).thenReturn(Optional.empty());
        Optional<ExpenseDTO> result = expenseService.getExpenseById("2");
        assertFalse(result.isPresent());
    }

    @Test
    void testDeleteExpenseSuccess() {
        when(expenseRepository.existsById("1")).thenReturn(true);
        assertDoesNotThrow(() -> expenseService.deleteExpense("1"));
        verify(expenseRepository, times(1)).deleteById("1");
    }

    @Test
    void testDeleteExpenseNotFound() {

        when(expenseRepository.existsById("2")).thenReturn(false);


        assertThrows(ExpenseNotFoundException.class, () -> expenseService.deleteExpense("2"));


        verify(expenseRepository, never()).deleteById("2");
    }

    @Test
    void testUpdateExpenseSuccess() {
        Expense updatedExpense = new Expense();
        updatedExpense.setId("1");
        updatedExpense.setDescription("Updated");
        updatedExpense.setAmount(100.0);
        updatedExpense.setCategory("Updated Category");
        updatedExpense.setDate(LocalDate.now());

        ExpenseDTO updatedExpenseDTO = ExpenseDTO.builder()
                .id("1")
                .description("Updated")
                .amount(100.0)
                .category("Updated Category")
                .date(LocalDate.now())
                .build();

        when(expenseRepository.findById("1")).thenReturn(Optional.of(expense));
        when(expenseRepository.save(any(Expense.class))).thenReturn(updatedExpense);

        ExpenseDTO result = expenseService.updateExpense("1", updatedExpenseDTO);
        assertEquals("Updated", result.getDescription());
        assertEquals(100.0, result.getAmount());
        assertEquals("Updated Category", result.getCategory());
    }

    @Test
    void testUpdateExpenseNotFound() {
        ExpenseDTO updatedExpenseDTO = ExpenseDTO.builder()
                .id("2")
                .description("Updated")
                .amount(100.0)
                .category("Updated Category")
                .date(LocalDate.now())
                .build();
        when(expenseRepository.findById("2")).thenReturn(Optional.empty());
        assertThrows(ExpenseNotFoundException.class, () -> expenseService.updateExpense("2", updatedExpenseDTO));
    }
}