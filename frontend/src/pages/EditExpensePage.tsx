
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchExpenseById, updateExpense } from '../api/expenseApi';
import ExpenseForm from '../components/ExpenseForm';
import { ExpenseDTO } from '../types/ExpenseDTO';

const EditExpensePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [expense, setExpense] = useState<ExpenseDTO | null>(null);


    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');

    useEffect(() => {
        if (id) {
            fetchExpenseById(id).then((data) => setExpense(data));
        }
    }, [id]);

    const handleSubmit = async (updatedExpense: ExpenseDTO) => {
        if (id) {
            await updateExpense(id, updatedExpense);

            if (category) {
                navigate(`/categories?selectedCategory=${category}`);
            } else {
                navigate('/categories');
            }
        }
    };

    if (!expense) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Edit Expense</h1>
            <ExpenseForm onSubmit={handleSubmit} initialData={expense} showCategoryField={!category} />
        </div>
    );
};

export default EditExpensePage;