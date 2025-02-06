// src/components/ExpenseList.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpenseDTO } from '../types/ExpenseDTO';
import styles from './ExpenseList.module.css';

interface ExpenseListProps {
    expenses: ExpenseDTO[];
    onDelete: (id: string) => Promise<void>;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete }) => {
    const navigate = useNavigate();

    return (
        <div className={styles.expenseList}>
            <div className={styles.header}>
                <h1>Expenses</h1>
                <div>
                    <button className={styles.returnButton} onClick={() => navigate('/')}>
                        Return
                    </button>
                    <button
                        className={styles.addButton}
                        onClick={() => navigate('/add-expense')}
                        style={{ marginLeft: '10px' }}
                    >
                        Add Expense
                    </button>
                </div>
            </div>
            <ul>
                {expenses.map((expense) => (
                    <li key={expense.id} className={styles.expenseItem}>
                        <span>
                            {expense.description} - €{expense.amount.toFixed(2)} ({expense.category})
                        </span>
                        <div>
                            <button
                                className={styles.editButton}
                                onClick={() => navigate(`/edit-expense/${expense.id}?category=${expense.category}`)}
                            >
                                Edit
                            </button>
                            <button
                                className={styles.deleteButton}
                                onClick={() => onDelete(expense.id!)}
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