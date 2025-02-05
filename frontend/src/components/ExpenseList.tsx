
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchExpenses, deleteExpense } from '../api/expenseApi';
import { ExpenseDTO } from '../types/ExpenseDTO';
import styles from './ExpenseList.module.css';

interface ExpenseListProps {
    category?: string;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ category }) => {
    const [expenses, setExpenses] = useState<ExpenseDTO[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getExpenses = async () => {
            const data = await fetchExpenses();
            if (category) {
                setExpenses(data.filter(exp => exp.category === category));
            } else {
                setExpenses(data);
            }
        };
        getExpenses();
    }, [category]);

    const handleDelete = async (id: string) => {
        await deleteExpense(id);
        setExpenses(expenses.filter((expense) => expense.id !== id));
    };

    return (
        <div className={styles.expenseList}>
            <div className={styles.header}>
                <h1>{category ? `Expenses for ${category}` : 'All Expenses'}</h1>
                <button className={styles.addButton} onClick={() => navigate('/add')}>
                    Add Expense
                </button>
            </div>
            <ul>
                {expenses.map((expense) => (
                    <li key={expense.id} className={styles.expenseItem}>
            <span>
              {expense.description} - ${expense.amount} ({expense.category})
            </span>
                        <div>
                            <button
                                className={styles.viewButton}
                                onClick={() => navigate(`/expense/${expense.id}`)}
                            >
                                View
                            </button>
                            <button
                                className={styles.editButton}
                                onClick={() => navigate(`/edit/${expense.id}`)}
                            >
                                Edit
                            </button>
                            <button
                                className={styles.deleteButton}
                                onClick={() => handleDelete(expense.id!)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExpenseList;
