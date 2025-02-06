import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchExpenseById } from '../api/expenseApi';
import { ExpenseDTO } from '../types/ExpenseDTO';
import styles from './ExpenseDetail.module.css';

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

    if (!expense) return <div className={styles.loading}>Loading...</div>;

    return (
        <div className={styles.expenseDetail}>
            <h1 className={styles.title}>{expense.description}</h1>
            <p className={styles.amount}>Amount: ${expense.amount}</p>
            <p className={styles.category}>Category: {expense.category}</p>
        </div>
    );
};

export default ExpenseDetail;