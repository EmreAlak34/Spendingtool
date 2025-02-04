import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchExpenseById } from '../api/expenseApi';
import { ExpenseDTO } from '../types/ExpenseDTO';

const ExpenseDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [expense, setExpense] = useState<ExpenseDTO | null>(null);

    useEffect(() => {
        const getExpense = async () => {
            const data = await fetchExpenseById(id!);
            setExpense(data);
        };
        getExpense();
    }, [id]);

    if (!expense) return <div>Loading...</div>;

    return (
        <div>
            <h1>{expense.description}</h1>
            <p>Amount: ${expense.amount}</p>
            <p>Category: {expense.category}</p>
        </div>
    );
};

export default ExpenseDetail;