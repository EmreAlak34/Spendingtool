// src/pages/AddExpensePage.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import { createExpense } from '../api/expenseApi';
import { ExpenseDTO } from '../types/ExpenseDTO';

const AddExpensePage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Extract the category from the query parameters
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');

    const handleSubmit = async (expenseDTO: ExpenseDTO) => {
        if (category) {
            expenseDTO.category = category; // Set the category from the query parameter
        }
        await createExpense(expenseDTO);
        // Redirect back to the category page after adding
        if (category) {
            navigate(`/categories?selectedCategory=${category}`);
        } else {
            navigate('/categories'); // Fallback if no category is provided
        }
    };

    return (
        <div>
            <h1>Add Expense</h1>
            <ExpenseForm onSubmit={handleSubmit} />
        </div>
    );
};

export default AddExpensePage;