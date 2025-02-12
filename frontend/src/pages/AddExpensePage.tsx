import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import { createExpense, fetchCategories } from '../api/expenseApi';
import { ExpenseDTO } from '../types/ExpenseDTO';
import { CategoryDTO } from '../types/CategoryDTO';
import { categories as initialCategories } from '../constants';

const AddExpensePage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [categories, setCategories] = useState<CategoryDTO[]>([]);

    useEffect(() => {
        fetchCategories()
            .then(fetchedCategories => {
                const fetchedCategoryNames = new Set(fetchedCategories.map(cat => cat.name));
                const allCategories = [
                    ...fetchedCategories,
                    ...initialCategories
                        .filter(initialCategory => !fetchedCategoryNames.has(initialCategory))
                        .map(initialCategory => ({ id: initialCategory, name: initialCategory })),
                ];
                setCategories(allCategories);
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
                alert("Failed to load categories. Please try again.");
            });
    }, []);

    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');

    const handleSubmit = async (expenseDTO: ExpenseDTO) => {
        if (category) {
            expenseDTO.category = category;
        }
        await createExpense(expenseDTO);


        if (category) {
            navigate(`/categories?selectedCategory=${category}`);
        } else {
            navigate('/');
        }
    };

    return (
        <div>

            <ExpenseForm onSubmit={handleSubmit} showCategoryField={!category} categories={categories} />
        </div>
    );
};

export default AddExpensePage;