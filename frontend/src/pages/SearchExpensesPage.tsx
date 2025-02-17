import React, { useState, useEffect } from 'react';
import { fetchExpenses, deleteExpense } from '../api/expenseApi';
import ExpenseList from '../components/ExpenseList';
import { ExpenseDTO } from '../types/ExpenseDTO';
import styles from './SearchExpensesPage.module.css';
import Slider from '@mui/material/Slider';

const SearchExpensesPage: React.FC = () => {
    const [expenses, setExpenses] = useState<ExpenseDTO[]>([]);
    const [searchText, setSearchText] = useState('');
    const [searchAmountRange, setSearchAmountRange] = useState<number[]>([0, 1000]);
    const [searchResults, setSearchResults] = useState<ExpenseDTO[]>([]);

    useEffect(() => {
        fetchExpenses().then((data: ExpenseDTO[]) => {
            setExpenses(data);
        });
    }, []);

    const handleSearchExpenses = () => {
        const results = expenses.filter(expense => {
            const matchesText = searchText === '' || expense.description.toLowerCase().includes(searchText.toLowerCase());
            const matchesAmount = expense.amount >= searchAmountRange[0] && expense.amount <= searchAmountRange[1];
            return matchesText && matchesAmount;
        });
        setSearchResults(results);
    };

    const handleDeleteExpense = async (id: string) => {
        await deleteExpense(id);
        setSearchResults(searchResults.filter(expense => expense.id !== id));
    };

    return (
        <div className={styles.searchContainer}>
            <h1>Search Expenses</h1>
            <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by description"
                className={styles.searchInput}
            />
            <div className={styles.sliderContainer}>
                <label>Amount range:</label>
                <Slider
                    value={searchAmountRange}
                    onChange={(_, newValue) => setSearchAmountRange(newValue as number[])}
                    valueLabelDisplay="auto"
                    min={0}
                    max={1000}
                />
            </div>
            <button onClick={handleSearchExpenses} className={styles.searchButton}>Search</button>

            {searchResults.length > 0 && (
                <div className={styles.resultsContainer}>
                    <h2>Search Results</h2>
                    <ExpenseList
                        expenses={searchResults}
                        onDelete={handleDeleteExpense}
                    />
                </div>
            )}
        </div>
    );
};

export default SearchExpensesPage;