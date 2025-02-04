import React, { useState } from 'react';
import { ExpenseDTO } from '../types/ExpenseDTO';

interface ExpenseFormProps {
    initialData?: ExpenseDTO;
    onSubmit: (expenseDTO: ExpenseDTO) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState<ExpenseDTO>(
        initialData || { description: '', amount: 0, category: '' }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Description</label>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Amount</label>
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Category</label>
                <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Save</button>
        </form>
    );
};

export default ExpenseForm;