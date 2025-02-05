
import React, { useEffect, useState } from 'react';
import { fetchExpenses, deleteExpense } from '../api/expenseApi';
import ExpenseList from '../components/ExpenseList';
import { ExpenseDTO } from '../types/ExpenseDTO'; // Import ExpenseDTO
import { useNavigate } from 'react-router-dom';
import { categories } from '../constants';

const HomePage: React.FC = () => {
    const [expenses, setExpenses] = useState<ExpenseDTO[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchExpenses().then((data: ExpenseDTO[]) => setExpenses(data));
    }, []);

    const handleDelete = async (id: string) => {
        await deleteExpense(id);
        setExpenses(expenses.filter(expense => expense.id !== id));
    };

    const handleEdit = (expense: ExpenseDTO) => {
        navigate(`/edit-expense/${expense.id}`);
    };

    return (
        <div>
            <h1>Categories</h1>
            <div style={{ marginBottom: '20px' }}>
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        style={{ marginRight: '10px' }}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {selectedCategory && (
                <div>
                    <h2>{selectedCategory}</h2>
                    <ExpenseList
                        expenses={expenses.filter(expense => expense.category === selectedCategory)}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                </div>
            )}
        </div>
    );
};

export default HomePage;