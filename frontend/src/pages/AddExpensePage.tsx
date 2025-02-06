
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import { createExpense } from '../api/expenseApi';
import { ExpenseDTO } from '../types/ExpenseDTO';

const AddExpensePage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');

    const handleSubmit = async (expenseDTO: ExpenseDTO) => {
        if (category) {
            expenseDTO.category = category;
        }
        await createExpense(expenseDTO);


        if (category) {
            navigate(`/categories?selectedCategory=${category}`);
        } else {
            navigate('/'); // Redirect to the homepage
        }
    };

    return (
        <div>
            <h1>Add Expense</h1>
            <ExpenseForm onSubmit={handleSubmit} showCategoryField={!category} />
        </div>
    );
};

export default AddExpensePage;