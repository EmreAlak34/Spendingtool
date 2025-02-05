import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpenseDTO } from '../types/ExpenseDTO';
import styles from './ExpenseList.module.css';

interface ExpenseListProps {
    expenses: ExpenseDTO[];
    onDelete: (id: string) => Promise<void>;
    onEdit: (expense: ExpenseDTO) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete, onEdit }) => {
    const navigate = useNavigate();

    return (
        <div className={styles.expenseList}>
            <div className={styles.header}>
                <h1>Expenses</h1>
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
                                onClick={() => onEdit(expense)}
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