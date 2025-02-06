// src/main/java/org/example/backend/dto/ExpenseDTO.java
package org.example.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder; // Add this
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder // Add this
public class ExpenseDTO {
    private String id;
    private String description;
    private double amount;
    private String category;
    private LocalDate date;
}