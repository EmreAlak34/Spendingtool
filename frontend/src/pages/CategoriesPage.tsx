import React, { useEffect, useState } from 'react';
import { fetchExpenses, deleteExpense, createCategory, updateCategory, deleteCategory } from '../api/expenseApi';
import ExpenseList from '../components/ExpenseList';
import { ExpenseDTO } from '../types/ExpenseDTO';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './CategoriesPage.module.css';
import axios from 'axios';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import { useCategoryContext } from '../context/CategoryContext';
import { categories as defaultCategories } from '../constants';

const CategoriesPage: React.FC = () => {
    const [expenses, setExpenses] = useState<ExpenseDTO[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const { categories, setCategories } = useCategoryContext(); // Use context
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [editedCategoryName, setEditedCategoryName] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [sortBy, setSortBy] = useState<keyof ExpenseDTO>('date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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

                setCategories(prevCategories => {
                    const updatedCategories = [...prevCategories, newCategory];
                    updatedCategories.sort((a, b) => a.name.localeCompare(b.name));
                    return updatedCategories;
                });
                setNewCategoryName('');
                navigate(`/categories?selectedCategory=${newCategory.name}`);
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    alert(error.response?.data);
                    console.error("Axios error:", error.response?.data);
                } else if (error instanceof Error) {
                    alert(error.message);
                    console.error("Error adding category:", error.message);
                } else {
                    alert("An unexpected error occurred.");
                    console.error("Error adding category:", error);
                }
            }
        }
    };

    const handleStartEdit = (categoryName: string) => {
        const category = categories.find(cat => cat.name === categoryName);
        if (category) {
            setEditingCategory(category.id);
            setEditedCategoryName(category.name);
        }
    };

    const handleSaveEdit = async (oldCategoryName: string) => {
        const category = categories.find(cat => cat.name === oldCategoryName);
        if (category && editedCategoryName.trim() !== '') {
            try {
                const updatedCategory = await updateCategory(category.id, editedCategoryName);

                setCategories(prevCategories => {
                    const updatedCategories = prevCategories.map(cat =>
                        cat.id === category.id ? updatedCategory : cat
                    );
                    updatedCategories.sort((a, b) => a.name.localeCompare(b.name));
                    return updatedCategories;
                });

                const updatedExpenses = expenses.map(expense => {
                    if (expense.category === oldCategoryName) {
                        return { ...expense, category: editedCategoryName.trim() };
                    }
                    return expense;
                });
                setExpenses(updatedExpenses);
                setEditingCategory(null);
                setEditedCategoryName('');

                if (selectedCategory === oldCategoryName) {
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

            setCategories(prevCategories => prevCategories.filter(cat => cat.id !== categoryId));

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
    };

    const sortedExpenses = [...expenses].sort((a, b) => {
        if (!sortBy) return 0;

        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (aValue === undefined || bValue === undefined) {
            return 0;
        }

        let comparison = 0;
        if (sortBy === 'amount') {
            comparison = (aValue as number) - (bValue as number);
        } else if (sortBy === 'date') {
            comparison = new Date(aValue as string).getTime() - new Date(bValue as string).getTime();
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
            comparison = aValue.localeCompare(bValue);
        }
        return sortDirection === 'asc' ? comparison : -comparison;
    });

    return (
        <div>
            <div className={styles.addCategoryContainer}>
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name"
                    className={styles.addCategoryInput}
                />
                <button onClick={handleAddCategory} className={styles.addCategoryButton}>Add Category</button>
            </div>

            <div className={styles.categoryList}>
                {categories.map(category => (
                    <div key={category.id} className={styles.categoryItem}>
                        {editingCategory === category.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editedCategoryName}
                                    onChange={(e) => setEditedCategoryName(e.target.value)}
                                    className={styles.editCategoryInput}
                                />
                                <button onClick={() => handleSaveEdit(category.name)} className={styles.saveEditButton}>Save</button>
                                <button onClick={handleCancelEdit} className={styles.cancelEditButton}>Cancel</button>
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
                                {!defaultCategories.includes(category.name) && (
                                    <>
                                        <button
                                            onClick={() => { handleStartEdit(category.name); }}
                                            className={styles.iconButton}
                                            aria-label="Rename Category"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => { handleDeleteCategory(category.id); }}
                                            className={styles.iconButton}
                                            aria-label="Delete Category"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>

            {selectedCategory && (
                <div>
                    <h2>{selectedCategory}</h2>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className={styles.sortByContainer}>
                            <label>
                                Sort By:
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as keyof ExpenseDTO)}
                                className={styles.sortByInput}
                            >
                                <option value="date">Date</option>
                                <option value="amount">Amount</option>
                                <option value="description">Alphabetically</option>
                            </select>
                        </div>
                        <div className={styles.directionContainer}>
                            <label>
                                Direction:
                            </label>
                            <select
                                value={sortDirection}
                                onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
                                className={styles.directionInput}
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(`/add-expense?category=${selectedCategory}`)}
                        className={styles.addExpenseButton}
                    >
                        Add Expense
                    </button>
                    <ExpenseList
                        expenses={sortedExpenses.filter(expense => expense.category === selectedCategory)}
                        onDelete={handleDeleteExpense}
                    />
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;