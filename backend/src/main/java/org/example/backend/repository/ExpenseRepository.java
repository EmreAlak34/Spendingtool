package org.example.backend.repository;

import org.example.backend.model.Expense;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends CrudRepository<Expense, String> {
    List<Expense> findAll();
}