package org.example.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@Document(collection = "expenses")
public class Expense {
    @Id
    private String id;
    private String description;
    private double amount;
    private String category;
    private LocalDate createdAt;
}
