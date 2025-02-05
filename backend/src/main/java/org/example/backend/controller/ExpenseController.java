package org.example.backend.controller;

import org.example.backend.dto.ExpenseDTO;
import org.example.backend.exception.ExpenseNotFoundException;
import org.example.backend.service.ExpenseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public List<ExpenseDTO> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    @PostMapping
    public ExpenseDTO saveExpense(@RequestBody ExpenseDTO expenseDTO) {
        return expenseService.saveExpense(expenseDTO);
    }

    @GetMapping("/{id}")
    public ExpenseDTO getExpenseById(@PathVariable String id) {
        return expenseService.getExpenseById(id);
    }

    @PutMapping("/{id}")
    public ExpenseDTO updateExpense(@PathVariable String id, @RequestBody ExpenseDTO updatedExpenseDTO) {
        return expenseService.updateExpense(id, updatedExpenseDTO);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable String id) {
        if (!expenseService.expenseExists(id)) {
            throw new ExpenseNotFoundException("Expense not found with id: " + id);
        }
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{category}")
    public List<ExpenseDTO> getExpensesByCategory(@PathVariable String category) {
        return expenseService.getExpensesByCategory(category);
    }

    @ExceptionHandler(ExpenseNotFoundException.class)
    public ResponseEntity<String> handleExpenseNotFound(ExpenseNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
}