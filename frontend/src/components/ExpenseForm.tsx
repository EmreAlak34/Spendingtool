
import React, { useState, useEffect } from 'react';
import { ExpenseDTO } from '../types/ExpenseDTO';
import styles from './ExpenseForm.module.css';
import { categories } from '../constants';

interface ExpenseFormProps {
    onSubmit: (expense: ExpenseDTO) => Promise<void>;
    initialData?: ExpenseDTO;
    showCategoryField?: boolean;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, initialData, showCategoryField = true }) => {
    const [description, setDescription] = useState(initialData?.description || '');
    const [amount, setAmount] = useState(initialData?.amount.toString() || '');
    const [category, setCategory] = useState(initialData?.category || '');

    useEffect(() => {
        if (initialData) {
            setDescription(initialData.description);
            setAmount(initialData.amount.toString());
            setCategory(initialData.category);
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const expenseDTO: ExpenseDTO = {
            description,
            amount: parseFloat(amount),
            category: showCategoryField ? category : initialData?.category || '',
        };

        await onSubmit(expenseDTO);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.expenseForm}>
            <div className={styles.formGroup}>
                <label>
                    Description:
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className={styles.input}
                    />
                </label>
            </div>
            <div className={styles.formGroup}>
                <label>
                    Amount:
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className={styles.input}
                    />
                </label>
            </div>
            {showCategoryField && (
                <div className={styles.formGroup}>
                    <label>
                        Category:
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            className={styles.input} // Keep the same styling
                        >
                            <option value="" disabled>Select a category</option> {/* Placeholder option */}
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </label>
                </div>
            )}
            <button type="submit" className={styles.saveButton}>Save Expense</button>
        </form>
    );
};

export default ExpenseForm;