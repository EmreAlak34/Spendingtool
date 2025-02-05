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

import java.util.Arrays;
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

    private Expense expenseFood;
    private Expense expenseTravel;
    private ExpenseDTO expenseDTOFood;
    private ExpenseDTO expenseDTOTravel;

    @BeforeEach
    void setUp() {
        expenseFood = new Expense("1", "Groceries", 50.0, "Food");
        expenseTravel = new Expense("2", "Flight Ticket", 200.0, "Travel");

        expenseDTOFood = new ExpenseDTO("1", "Groceries", 50.0, "Food");
        expenseDTOTravel = new ExpenseDTO("2", "Flight Ticket", 200.0, "Travel");
    }

    @Test
    void testGetAllExpenses() {
        List<Expense> expenses = Arrays.asList(expenseFood);
        when(expenseRepository.findAll()).thenReturn(expenses);

        List<ExpenseDTO> result = expenseService.getAllExpenses();
        assertEquals(1, result.size());
        assertEquals("Groceries", result.get(0).getDescription());
    }

    @Test
    void testSaveExpense() {
        when(expenseRepository.save(any(Expense.class))).thenReturn(expenseFood);
        ExpenseDTO result = expenseService.saveExpense(expenseDTOFood);
        assertNotNull(result);
        assertEquals("Groceries", result.getDescription());
    }

    @Test
    void testGetExpenseByIdFound() {
        when(expenseRepository.findById("1")).thenReturn(Optional.of(expenseFood));
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
        when(expenseRepository.findById("1")).thenReturn(Optional.of(expenseFood));
        doNothing().when(expenseRepository).delete(expenseFood);

        assertDoesNotThrow(() -> expenseService.deleteExpense("1"));
        verify(expenseRepository, times(1)).delete(expenseFood);
    }

    @Test
    void testDeleteExpenseNotFound() {
        when(expenseRepository.findById("2")).thenReturn(Optional.empty());
        assertThrows(ExpenseNotFoundException.class, () -> expenseService.deleteExpense("2"));
    }

    @Test
    void testUpdateExpenseSuccess() {
        Expense updatedExpense = new Expense("1", "Updated", 100.0, "Food");
        ExpenseDTO updatedExpenseDTO = new ExpenseDTO("1", "Updated", 100.0, "Food");

        when(expenseRepository.findById("1")).thenReturn(Optional.of(expenseFood));
        when(expenseRepository.save(any(Expense.class))).thenReturn(updatedExpense);

        ExpenseDTO result = expenseService.updateExpense("1", updatedExpenseDTO);
        assertEquals("Updated", result.getDescription());
        assertEquals(100.0, result.getAmount());
        assertEquals("Food", result.getCategory());
    }

    @Test
    void testUpdateExpenseNotFound() {
        ExpenseDTO updatedExpenseDTO = new ExpenseDTO("2", "Updated", 100.0, "Other");
        when(expenseRepository.findById("2")).thenReturn(Optional.empty());
        assertThrows(ExpenseNotFoundException.class, () -> expenseService.updateExpense("2", updatedExpenseDTO));
    }


    @Test
    void testGetDistinctCategories() {
        List<Expense> expenses = Arrays.asList(expenseFood, expenseTravel, expenseFood);
        when(expenseRepository.findAll()).thenReturn(expenses);
        List<String> distinctCategories = expenseService.getDistinctCategories();
        assertEquals(2, distinctCategories.size());
        assertTrue(distinctCategories.contains("Food"));
        assertTrue(distinctCategories.contains("Travel"));
    }
}
