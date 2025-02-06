import React, { useEffect, useState } from 'react';
import { fetchExpenses, deleteExpense } from '../api/expenseApi';
import ExpenseList from '../components/ExpenseList';
import { ExpenseDTO } from '../types/ExpenseDTO';
import { useNavigate, useLocation } from 'react-router-dom';
import { categories } from '../constants';
import styles from './CategoriesPage.module.css';

const CategoriesPage: React.FC = () => {
    const [expenses, setExpenses] = useState<ExpenseDTO[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [localCategories, setLocalCategories] = useState<string[]>(categories);
    const [newCategoryName, setNewCategoryName] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const categoryName = queryParams.get('selectedCategory');
        setSelectedCategory(categoryName);
    }, [location.search]);

    useEffect(() => {
        fetchExpenses().then((data: ExpenseDTO[]) => setExpenses(data));
    }, []);

    const handleDeleteExpense = async (id: string) => {
        await deleteExpense(id);
        setExpenses(expenses.filter(expense => expense.id !== id));
    };

    const handleAddCategory = () => {
        if (newCategoryName.trim() !== '' && !localCategories.includes(newCategoryName.trim())) {
            setLocalCategories([...localCategories, newCategoryName.trim()]);
            setNewCategoryName('');
            navigate(`/categories?selectedCategory=${newCategoryName.trim()}`);

        }
    };

    return (
        <div>
            <h1>Categories</h1>

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name"
                    className={styles.addCategoryInput}
                />
                <button onClick={handleAddCategory}>Add Category</button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                {localCategories.map(category => (
                    <button
                        key={category}
                        onClick={() => {
                            setSelectedCategory(category);
                            navigate(`/categories?selectedCategory=${category}`);
                        }}
                        className={styles.categoryButton}
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
                        onDelete={handleDeleteExpense}
                    />
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;