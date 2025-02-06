import axios from 'axios';

import { ExpenseDTO } from '../types/ExpenseDTO';



const API_URL = '/api/expenses';



export const fetchExpenses = async (): Promise<ExpenseDTO[]> => {

    const response = await axios.get(API_URL);

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