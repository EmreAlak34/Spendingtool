package org.example.backend.service;

import org.example.backend.dto.ExpenseDTO;
import org.example.backend.exception.ExpenseNotFoundException;
import org.example.backend.model.Expense;
import org.example.backend.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public List<ExpenseDTO> getAllExpenses() {
        return expenseRepository.findAll().stream()
                .map(expense -> new ExpenseDTO(expense.getId(), expense.getDescription(), expense.getAmount(), expense.getCategory()))
                .collect(Collectors.toList());
    }

    public ExpenseDTO saveExpense(ExpenseDTO expenseDTO) {
        Expense expense = new Expense();
        expense.setDescription(expenseDTO.getDescription());
        expense.setAmount(expenseDTO.getAmount());
        expense.setCategory(expenseDTO.getCategory());

        Expense savedExpense = expenseRepository.save(expense);
        return new ExpenseDTO(savedExpense.getId(), savedExpense.getDescription(), savedExpense.getAmount(), savedExpense.getCategory());
    }

    public Optional<ExpenseDTO> getExpenseById(String id) {
        return expenseRepository.findById(id)
                .map(expense -> new ExpenseDTO(expense.getId(), expense.getDescription(), expense.getAmount(), expense.getCategory()));
    }

    public void deleteExpense(String id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ExpenseNotFoundException("Expense not found with id: " + id));
        expenseRepository.delete(expense);
    }

    public ExpenseDTO updateExpense(String id, ExpenseDTO updatedExpenseDTO) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ExpenseNotFoundException("Expense not found with id: " + id));

        expense.setDescription(updatedExpenseDTO.getDescription());
        expense.setAmount(updatedExpenseDTO.getAmount());
        expense.setCategory(updatedExpenseDTO.getCategory());
        Expense updatedExpense = expenseRepository.save(expense);
        return new ExpenseDTO(updatedExpense.getId(), updatedExpense.getDescription(), updatedExpense.getAmount(), updatedExpense.getCategory());
    }










}