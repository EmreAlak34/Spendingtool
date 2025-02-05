import React, { useState } from 'react';
import { ExpenseDTO } from '../types/ExpenseDTO';
import styles from './ExpenseForm.module.css';

interface ExpenseFormProps {
    initialData?: ExpenseDTO;
    onSubmit: (expenseDTO: ExpenseDTO) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState<ExpenseDTO>(
        initialData || { description: '', amount: 0, category: '' }
    );
    const [isCustomCategory, setIsCustomCategory] = useState(false);

    const categories = [
        'Groceries',
        'Hobbies',
        'Travelling',
        'Transportation',
        'School',
        'College',
        'Car',
        'Friends',

    ];

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });


        if (name === 'category' && value === 'Other') {
            setIsCustomCategory(true);
            setFormData({ ...formData, category: '' });
        } else if (name === 'category') {
            setIsCustomCategory(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form className={styles.expenseForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label>Description</label>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label>Amount</label>
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label>Category</label>
                {isCustomCategory ? (
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Enter category"
                        required
                    />
                ) : (
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>
                            Select a category
                        </option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                        <option value="Other">Other</option>
                    </select>
                )}
            </div>
            <button type="submit" className={styles.saveButton}>
                Save
            </button>
        </form>
    );
};

export default ExpenseForm;