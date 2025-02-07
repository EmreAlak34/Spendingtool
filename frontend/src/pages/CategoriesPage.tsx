import React, { useEffect, useState } from 'react';
import { fetchExpenses, deleteExpense, fetchCategories, createCategory, updateCategory, deleteCategory } from '../api/expenseApi';
import ExpenseList from '../components/ExpenseList';
import { ExpenseDTO } from '../types/ExpenseDTO';
import { CategoryDTO } from '../types/CategoryDTO';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './CategoriesPage.module.css';
import axios from 'axios';

const CategoriesPage: React.FC = () => {
    const [expenses, setExpenses] = useState<ExpenseDTO[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [editedCategoryName, setEditedCategoryName] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchCategories().then(data => setCategories(data));
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const categoryName = queryParams.get('selectedCategory');

        fetchExpenses().then((data: ExpenseDTO[]) => {
            setExpenses(data);
            const category = categories.find(cat => cat.name === categoryName);
            if (category) {
                setSelectedCategory(category.name);
            } else {
                setSelectedCategory(null);
            }
        });
    }, [location.search, categories]);

    const handleDeleteExpense = async (id: string) => {
        await deleteExpense(id);
        setExpenses(expenses.filter(expense => expense.id !== id));
    };

    const handleAddCategory = async () => {
        if (newCategoryName.trim() !== '') {
            try {
                const newCategory = await createCategory(newCategoryName);
                setCategories([...categories, newCategory]);
                setNewCategoryName('');
                navigate(`/categories?selectedCategory=${newCategory.name}`);
            } catch (error: unknown) { // Use unknown
                if (axios.isAxiosError(error)) {
                    alert(error.response?.data);
                    console.error("Axios error:", error.response?.data);
                } else if (error instanceof Error) {
                    alert(error.message); // Fallback to generic Error
                    console.error("Error adding category:", error.message);
                } else {
                    alert("An unexpected error occurred.");
                    console.error("Error adding category:", error);
                }
            }
        }
    };

    const handleStartEdit = (categoryName: string) => {
        const category = categories.find(cat => cat.name === categoryName)
        if (category) {
            setEditingCategory(category.id);
            setEditedCategoryName(category.name);
        }

    };

    const handleSaveEdit = async (oldCategoryName: string) => {
        const category = categories.find(cat => cat.name === oldCategoryName)

        if (category && editedCategoryName.trim() !== '') {
            try {
                const updatedCategory = await updateCategory(category.id, editedCategoryName);
                const updatedCategories = categories.map((cat) =>
                    cat.id === category.id ? updatedCategory : cat
                );

                const updatedExpenses = expenses.map(expense => {
                    if (expense.category === oldCategoryName) {
                        return { ...expense, category: editedCategoryName.trim() };
                    }
                    return expense;
                });
                setExpenses(updatedExpenses);

                setCategories(updatedCategories);
                setEditingCategory(null);
                setEditedCategoryName('');


                if(selectedCategory === oldCategoryName){
                    navigate(`/categories?selectedCategory=${updatedCategory.name}`);

                }
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    alert(error.response?.data);
                    console.error("Axios error:", error.response?.data);
                } else if (error instanceof Error) {
                    alert(error.message);
                    console.error("Error updating category:", error.message);
                } else {
                    alert("An unexpected error occurred.");
                    console.error("Error updating category:", error);
                }
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
        setEditedCategoryName('');
    };
    const handleDeleteCategory = async (categoryId: string) => {
        try {
            await deleteCategory(categoryId);
            const updatedCategories = categories.filter(cat => cat.id !== categoryId);
            setCategories(updatedCategories);
            if (selectedCategory === categories.find(cat => cat.id === categoryId)?.name) {
                setSelectedCategory(null);
                navigate(`/categories`);
            }

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data);
                console.error("Axios error:", error.response?.data);
            } else if (error instanceof Error) {
                alert(error.message);
                console.error("Error deleting category:", error.message);
            } else {
                alert("An unexpected error occurred");
                console.error("Error deleting category:", error);
            }
        }
    }

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
                {categories.map(category => (
                    <div key={category.id} style={{ display: 'inline-block', marginRight: '10px', marginBottom: '10px' }}>
                        {editingCategory === category.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editedCategoryName}
                                    onChange={(e) => setEditedCategoryName(e.target.value)}
                                />
                                <button onClick={() => handleSaveEdit(category.name)}>Save</button>
                                <button onClick={handleCancelEdit}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        setSelectedCategory(category.name);
                                        navigate(`/categories?selectedCategory=${category.name}`);
                                    }}
                                    className={styles.categoryButton}
                                >
                                    {category.name}
                                </button>
                                <button onClick={() => handleStartEdit(category.name)}>Rename</button>
                                <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
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
                        className={styles.addExpenseButton}
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