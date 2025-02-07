import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchExpenseById, updateExpense, fetchCategories } from '../api/expenseApi';
import ExpenseForm from '../components/ExpenseForm';
import { ExpenseDTO } from '../types/ExpenseDTO';
import { CategoryDTO } from '../types/CategoryDTO';
import axios from 'axios';

const EditExpensePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [expense, setExpense] = useState<ExpenseDTO | null>(null);
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) {
                    setError("No expense ID provided.");
                    setLoading(false);
                    return;
                }

                const expenseData = await fetchExpenseById(id);
                setExpense(expenseData);

                const categoriesData = await fetchCategories();
                setCategories(categoriesData);

            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data || "An error occurred fetching data.");
                } else {
                    setError("An unexpected error occurred.");
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (updatedExpense: ExpenseDTO) => {
        if (id && expense) { // Make sure expense exists
            try{
                // Keep date, and all other properties.
                const finalExpense : ExpenseDTO = {...expense, ...updatedExpense}
                await updateExpense(id, finalExpense);
                if(category){
                    navigate(`/categories?selectedCategory=${category}`);

                } else{
                    navigate("/");
                }

            } catch(error: unknown){
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


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!expense) {
        return <div>Expense not found.</div>;
    }

    return (
        <div>
            <h1>Edit Expense</h1>
            <ExpenseForm onSubmit={handleSubmit} initialData={expense} categories={categories} showCategoryField={!category}/>
        </div>
    );
};

export default EditExpensePage;