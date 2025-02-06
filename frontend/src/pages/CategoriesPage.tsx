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
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const categoryName = queryParams.get('selectedCategory');
        setSelectedCategory(categoryName);

        fetchExpenses().then((data: ExpenseDTO[]) => {
            setExpenses(data);
        });

    }, [location.search]);


    const handleDeleteExpense = async (id: string) => {
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
                        className={styles.addExpenseButton} // ADD THIS CLASS
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