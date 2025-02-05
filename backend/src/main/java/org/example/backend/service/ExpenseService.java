package org.example.backend.service;

import org.example.backend.dto.ExpenseDTO;
import org.example.backend.exception.ExpenseNotFoundException;
import org.example.backend.model.Expense;
import org.example.backend.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenseService {
    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public ExpenseDTO saveExpense(ExpenseDTO expenseDTO) {
        Expense expense = new Expense();
        expense.setDescription(expenseDTO.getDescription());
        expense.setAmount(expenseDTO.getAmount());
        expense.setCategory(expenseDTO.getCategory());
        expense.setCreatedAt(LocalDate.now());
        Expense savedExpense = expenseRepository.save(expense);
        return mapToDTO(savedExpense);
    }

    public List<ExpenseDTO> getAllExpenses() {
        return expenseRepository.findAll().stream()
                .map(this::mapToDTO)
                .toList();
    }

    public boolean expenseExists(String id) {
        return expenseRepository.existsById(id);
    }

    public ExpenseDTO getExpenseById(String id) {
        return expenseRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new ExpenseNotFoundException("Expense not found with id: " + id));
    }

    public ExpenseDTO updateExpense(String id, ExpenseDTO updatedExpenseDTO) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ExpenseNotFoundException("Expense not found with id: " + id));

        expense.setDescription(updatedExpenseDTO.getDescription());
        expense.setAmount(updatedExpenseDTO.getAmount());
        expense.setCategory(updatedExpenseDTO.getCategory());
        Expense updatedExpense = expenseRepository.save(expense);
        return mapToDTO(updatedExpense);
    }

    public void deleteExpense(String id) {
        if (!expenseRepository.existsById(id)) {
            throw new ExpenseNotFoundException("Expense not found with id: " + id);
        }
        expenseRepository.deleteById(id);
    }

    public List<ExpenseDTO> getExpensesByCategory(String category) {
        return expenseRepository.findByCategory(category).stream()
                .map(this::mapToDTO)
                .toList();
    }

    private ExpenseDTO mapToDTO(Expense expense) {
        return new ExpenseDTO(
                expense.getId(),
                expense.getDescription(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getCreatedAt()
        );
    }
}
