package org.example.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseDTO {
    private String id;
    private String description;
    private double amount;
    private String category;
    private LocalDateTime createdAt;


    public ExpenseDTO(String id, String description, double amount, String category) {
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.createdAt = LocalDateTime.now();
    }
}
