package org.example.backend.service;

import org.example.backend.exception.ExpenseNotFoundException;
import org.example.backend.model.Expense;
import org.example.backend.repository.ExpenseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
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

    @BeforeEach
    void setUp() {
        expense = new Expense();
        expense.setId("1");
        expense.setDescription("Groceries");
        expense.setAmount(50.0);
        expense.setCategory("Food");
    }

    @Test
    void testGetAllExpenses() {
        List<Expense> expenses = new ArrayList<>();
        expenses.add(expense);
        when(expenseRepository.findAll()).thenReturn(expenses);

        List<Expense> result = expenseService.getAllExpenses();
        assertEquals(1, result.size());
        assertEquals("Groceries", result.getFirst().getDescription());
    }

    @Test
    void testSaveExpense() {
        when(expenseRepository.save(expense)).thenReturn(expense);
        Expense result = expenseService.saveExpense(expense);
        assertNotNull(result);
        assertEquals("Groceries", result.getDescription());
    }

    @Test
    void testGetExpenseByIdFound() {
        when(expenseRepository.findById("1")).thenReturn(Optional.of(expense));
        Optional<Expense> result = expenseService.getExpenseById("1");
        assertTrue(result.isPresent());
        assertEquals("Groceries", result.get().getDescription());
    }

    @Test
    void testGetExpenseByIdNotFound() {
        when(expenseRepository.findById("2")).thenReturn(Optional.empty());
        Optional<Expense> result = expenseService.getExpenseById("2");
        assertFalse(result.isPresent());
    }

    @Test
    void testDeleteExpenseSuccess() {
        when(expenseRepository.findById("1")).thenReturn(Optional.of(expense));
        doNothing().when(expenseRepository).delete(expense);

        assertDoesNotThrow(() -> expenseService.deleteExpense("1"));
        verify(expenseRepository, times(1)).delete(expense);
    }

    @Test
    void testDeleteExpenseNotFound() {
        when(expenseRepository.findById("2")).thenReturn(Optional.empty());
        assertThrows(ExpenseNotFoundException.class, () -> expenseService.deleteExpense("2"));
    }

    @Test
    void testUpdateExpenseSuccess() {
        Expense updatedExpense = new Expense();
        updatedExpense.setDescription("Updated");
        updatedExpense.setAmount(100.0);
        updatedExpense.setCategory("Updated Category");

        when(expenseRepository.findById("1")).thenReturn(Optional.of(expense));
        when(expenseRepository.save(any(Expense.class))).thenReturn(updatedExpense);

        Expense result = expenseService.updateExpense("1", updatedExpense);
        assertEquals("Updated", result.getDescription());
        assertEquals(100.0, result.getAmount());
        assertEquals("Updated Category", result.getCategory());
    }

    @Test
    void testUpdateExpenseNotFound() {
        Expense updatedExpense = new Expense();
        when(expenseRepository.findById("2")).thenReturn(Optional.empty());
        assertThrows(ExpenseNotFoundException.class, () -> expenseService.updateExpense("2", updatedExpense));
    }
}
