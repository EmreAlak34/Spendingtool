
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