import React, { useState, useEffect } from 'react';
import { ExpenseDTO } from '../types/ExpenseDTO';
import { CategoryDTO } from '../types/CategoryDTO';
import styles from './ExpenseForm.module.css';

interface ExpenseFormProps {
    onSubmit: (expense: ExpenseDTO) => Promise<void>;
    initialData?: ExpenseDTO;
    showCategoryField?: boolean;
    categories: CategoryDTO[];
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, initialData, showCategoryField = true, categories }) => {
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

    // Sort categories alphabetically by name *before* rendering
    const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));

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
                            className={styles.input}
                        >
                            <option value="" disabled>Select a category</option>
                            {/* Use sortedCategories here */}
                            {sortedCategories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
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