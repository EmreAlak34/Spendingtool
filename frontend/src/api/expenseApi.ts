import axios from 'axios';
import { ExpenseDTO } from '../types/ExpenseDTO';
import { CategoryDTO } from '../types/CategoryDTO';

const API_URL = '/api/expenses';
const CATEGORY_API_URL = 'http://localhost:8080/api/categories';

export const fetchExpenses = async (
    description?: string,
    category?: string | null,
    minAmount?: number,
    maxAmount?: number,
    startDate?: string,
    endDate?: string,
    sortBy?: string,
    sortDirection?: string

): Promise<ExpenseDTO[]> => {

    const params = new URLSearchParams();
    if (description) params.append('description', description);
    if (category) params.append('category', category);
    if (minAmount !== undefined) params.append('minAmount', minAmount.toString());
    if (maxAmount !== undefined) params.append('maxAmount', maxAmount.toString());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortDirection) params.append('sortDirection', sortDirection);

    const response = await axios.get(API_URL, { params });
    return response.data;
};

export const fetchExpenseById = async (id: string): Promise<ExpenseDTO> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createExpense = async (expenseDTO: ExpenseDTO): Promise<ExpenseDTO> => {
    const response = await axios.post(API_URL, expenseDTO);
    return response.data;
};

export const updateExpense = async (id: string, expenseDTO: ExpenseDTO): Promise<ExpenseDTO> => {
    const response = await axios.put(`${API_URL}/${id}`, expenseDTO);
    return response.data;
};

export const deleteExpense = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};

export const fetchCategories = async (): Promise<CategoryDTO[]> => {
    const response = await axios.get<CategoryDTO[]>(CATEGORY_API_URL);
    return response.data;
};

export const createCategory = async (categoryName: string): Promise<CategoryDTO> => {
    const response = await axios.post<CategoryDTO>(CATEGORY_API_URL, { name: categoryName });
    return response.data;
};

export const updateCategory = async (id: string, categoryName: string): Promise<CategoryDTO> => {
    const response = await axios.put<CategoryDTO>(`${CATEGORY_API_URL}/${id}`, { name: categoryName });
    return response.data;
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
    await axios.delete(`${CATEGORY_API_URL}/${categoryId}`);
};