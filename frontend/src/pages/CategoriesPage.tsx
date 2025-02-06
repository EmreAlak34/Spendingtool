import React, { useEffect, useState, useCallback } from 'react';
import { fetchExpenses, deleteExpense } from '../api/expenseApi';
import ExpenseList from '../components/ExpenseList';
import { ExpenseDTO } from '../types/ExpenseDTO';
import { useNavigate, useLocation } from 'react-router-dom';
import { categories as initialCategories } from '../constants';
import styles from './CategoriesPage.module.css';

const CategoriesPage: React.FC = () => {
    const [expenses, setExpenses] = useState<ExpenseDTO[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [localCategories, setLocalCategories] = useState<string[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [editedCategoryName, setEditedCategoryName] = useState('');
    const navigate = useNavigate();
    const location = useLocation();


    const getCategories = useCallback(() => {
        const savedCategories = localStorage.getItem('categories');
        return savedCategories ? JSON.parse(savedCategories) : initialCategories;
    }, []);

    useEffect(() => {

        const currentCategories = getCategories();
        setLocalCategories(currentCategories);


        const queryParams = new URLSearchParams(location.search);
        const categoryName = queryParams.get('selectedCategory');


        fetchExpenses().then((data: ExpenseDTO[]) => {
            setExpenses(data);


            if (categoryName && currentCategories.includes(categoryName)) {
                setSelectedCategory(categoryName);
            } else {
                setSelectedCategory(null);
            }
        });

    }, [location.search, getCategories]);


    useEffect(() => {
        localStorage.setItem('categories', JSON.stringify(localCategories));
    }, [localCategories]);

    const handleDeleteExpense = async (id: string) => {
        await deleteExpense(id);
        setExpenses(expenses.filter(expense => expense.id !== id));
    };

    const handleAddCategory = () => {
        if (newCategoryName.trim() !== '' && !localCategories.map(cat => cat.toLowerCase()).includes(newCategoryName.trim().toLowerCase())) {
            const newCategory = newCategoryName.trim();
            const updatedCategories = [...localCategories, newCategory];
            setLocalCategories(updatedCategories);
            setNewCategoryName('');
            navigate(`/categories?selectedCategory=${newCategory}`);
        }
    };

    const handleStartEdit = (category: string) => {
        setEditingCategory(category);
        setEditedCategoryName(category);
    };

    const handleSaveEdit = (oldCategoryName: string) => {
        if (editedCategoryName.trim() !== '' && !localCategories.map(cat => cat.toLowerCase()).includes(editedCategoryName.trim().toLowerCase())) {
            const updatedCategories = localCategories.map(cat =>
                cat === oldCategoryName ? editedCategoryName.trim() : cat
            );

            const updatedExpenses = expenses.map(expense => {
                if (expense.category === oldCategoryName) {
                    return { ...expense, category: editedCategoryName.trim() };
                }
                return expense;
            });
            setExpenses(updatedExpenses);
            setLocalCategories(updatedCategories);


            setEditingCategory(null);
            setEditedCategoryName('');

            if (selectedCategory === oldCategoryName) {
                navigate(`/categories?selectedCategory=${editedCategoryName.trim()}`);
            }

        }
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
        setEditedCategoryName('');
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
                    <div key={category} style={{ display: 'inline-block', marginRight: '10px', marginBottom: '10px' }}>
                        {editingCategory === category ? (
                            <>
                                <input
                                    type="text"
                                    value={editedCategoryName}
                                    onChange={(e) => setEditedCategoryName(e.target.value)}
                                />
                                <button onClick={() => handleSaveEdit(category)}>Save</button>
                                <button onClick={handleCancelEdit}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        navigate(`/categories?selectedCategory=${category}`);
                                    }}
                                    className={styles.categoryButton}
                                >
                                    {category}
                                </button>
                                <button onClick={() => handleStartEdit(category)}>Rename</button>
                            </>
                        )}
                    </div>
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