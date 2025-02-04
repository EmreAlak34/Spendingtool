package org.example.backend.dto;

public class ExpenseDTO {
    private String id;
    private String description;
    private double amount;
    private String category;

    public ExpenseDTO() {}

    public ExpenseDTO(String id, String description, double amount, String category) {
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.category = category;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getCategory() { return category; }  // Ensure this method exists
    public void setCategory(String category) { this.category = category; }
}
