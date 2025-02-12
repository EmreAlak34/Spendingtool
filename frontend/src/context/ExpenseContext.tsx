// src/context/ExpenseContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ExpenseDTO } from '../types/ExpenseDTO';
import { fetchExpenses } from '../api/expenseApi';

interface ExpenseContextProps {
    expenses: ExpenseDTO[];
    setExpenses: React.Dispatch<React.SetStateAction<ExpenseDTO[]>>;
    refreshExpenses: () => Promise<void>; // Add this for manual refresh
}

const ExpenseContext = createContext<ExpenseContextProps | undefined>(undefined);

interface ExpenseProviderProps {
    children: ReactNode;
}

export const ExpenseProvider: React.FC<ExpenseProviderProps> = ({ children }) => {
    const [expenses, setExpenses] = useState<ExpenseDTO[]>([]);

    const refreshExpenses = async () => {
        try {
            const data = await fetchExpenses();
            setExpenses(data);
        } catch (error) {
            console.error("Error fetching expenses:", error);

        }
    };


    useEffect(() => {
        refreshExpenses();
    }, []);


    const contextValue = {
        expenses,
        setExpenses,
        refreshExpenses
    };

    return (
        <ExpenseContext.Provider value={contextValue}>
            {children}
        </ExpenseContext.Provider>
    );
};

export const useExpenseContext = () => {
    const context = useContext(ExpenseContext);
    if (!context) {
        throw new Error('useExpenseContext must be used within an ExpenseProvider');
    }
    return context;
};