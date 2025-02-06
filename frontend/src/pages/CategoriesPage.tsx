
import React, { useEffect, useState } from 'react';
import { fetchExpenses, deleteExpense } from '../api/expenseApi';
import ExpenseList from '../components/ExpenseList';
import { ExpenseDTO } from '../types/ExpenseDTO';
import { useNavigate, useLocation } from 'react-router-dom';
import { categories } from '../constants';

const CategoriesPage: React.FC = () => {
    const [expenses, setExpenses] = useState<ExpenseDTO[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Extract the selectedCategory from the query parameters
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const category = queryParams.get('selectedCategory');
        if (category) {
            setSelectedCategory(category);
        }
    }, [location.search]);

    useEffect(() => {
        fetchExpenses().then((data: ExpenseDTO[]) => setExpenses(data));
    }, []);

    const handleDelete = async (id: string) => {
        await deleteExpense(id);
        setExpenses(expenses.filter(expense => expense.id !== id));
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
                    <button
                        onClick={() => navigate(`/add-expense?category=${selectedCategory}`)}
                        style={{ marginBottom: '20px' }}
                    >
                        Add Expense
                    </button>
                    <ExpenseList
                        expenses={expenses.filter(expense => expense.category === selectedCategory)}
                        onDelete={handleDelete}
                    />
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;