import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchExpenseById, updateExpense } from '../api/expenseApi';
import ExpenseForm from '../components/ExpenseForm';
import { ExpenseDTO } from '../types/ExpenseDTO';

const EditExpensePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [expense, setExpense] = useState<ExpenseDTO | null>(null);

    useEffect(() => {
        const getExpense = async () => {
            const data = await fetchExpenseById(id!);
            setExpense(data);
        };
        getExpense();
    }, [id]);

    const handleSubmit = async (updatedExpenseDTO: ExpenseDTO) => {
        await updateExpense(id!, updatedExpenseDTO);
        navigate('/');
    };

    if (!expense) return <div>Loading...</div>;

    return (
        <div>
            <h1>Edit Expense</h1>
            <ExpenseForm initialData={expense} onSubmit={handleSubmit} />
        </div>
    );
};

export default EditExpensePage;