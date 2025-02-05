import React from 'react';
import ExpenseForm from '../components/ExpenseForm';
import { createExpense } from '../api/expenseApi';
import { useNavigate } from 'react-router-dom';
import {ExpenseDTO} from "../types/ExpenseDTO.ts";

const AddExpensePage: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = async (expenseDTO: ExpenseDTO) => {
        await createExpense(expenseDTO);
        navigate('/');
    };

    return (
        <div>
            <h1>Add Expense</h1>
            <ExpenseForm onSubmit={handleSubmit} />
        </div>
    );
};

export default AddExpensePage;