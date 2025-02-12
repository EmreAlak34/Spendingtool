import React, { useMemo, useEffect } from 'react';
import styles from './HomePage.module.css';
import { useExpenseContext } from '../context/ExpenseContext';
import { useCategoryContext } from '../context/CategoryContext';

const HomePage: React.FC = () => {
    const { expenses, refreshExpenses } = useExpenseContext();
    const { categories } = useCategoryContext();

    useEffect(() => {
        refreshExpenses();
    }, [refreshExpenses]);

    const getCurrentMonthExpenses = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth &&
                expenseDate.getFullYear() === currentYear;
        });
    };

    const currentMonthExpenses = getCurrentMonthExpenses();
    const totalSpendingThisMonth = currentMonthExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
    );

    const categoryData = useMemo(() => {
        const categorySpending: { [key: string]: number } = {};
        const validExpenses = currentMonthExpenses.filter(expense =>
            categories.some(cat => cat.name === expense.category)
        );
        validExpenses.forEach(expense => {
            categorySpending[expense.category] = (categorySpending[expense.category] || 0) + expense.amount;
        });

        return Object.entries(categorySpending).map(([category, amount]) => ({
            category,
            amount,
        }));
    }, [currentMonthExpenses, categories]);

    const recentExpenses = useMemo(() => {
        return [...expenses]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);
    }, [expenses]);

    return (
        <div className={styles.homePage}>

            <section className={styles.welcomeSection}>
                <h1>Welcome to Spending Harmony!</h1>
                <p>Track your expenses and stay on top of your finances.</p>
            </section>


            <section className={styles.overviewSection}>
                <h2>Monthly Overview</h2>
                <table className={styles.budgetTable}>
                    <thead>
                    <tr>
                        <th>Category</th>
                        <th>Spent</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categoryData.map(({ category, amount }) => (
                        <tr key={category}>
                            <td>{category}</td>
                            <td>
                                {amount.toLocaleString('de-DE', {
                                    style: 'currency',
                                    currency: 'EUR'
                                })}
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td><strong>Total</strong></td>
                        <td>
                            <strong>
                                {totalSpendingThisMonth.toLocaleString('de-DE', {
                                    style: 'currency',
                                    currency: 'EUR'
                                })}
                            </strong>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </section>


            <section className={styles.recentExpensesSection}>
                <h2>Recent Expenses</h2>
                {recentExpenses.length > 0 ? (
                    <ul>
                        {recentExpenses.map(expense => (
                            <li key={expense.id} className={styles.expenseItem}>
                                <span className={styles.expenseDate}>
                                    {new Date(expense.date).toLocaleDateString()}
                                </span>
                                <span className={styles.expenseDescription}>
                                    {expense.description}
                                </span>
                                <span className={styles.expenseAmount}>
                                    {expense.amount.toLocaleString('de-DE', {
                                        style: 'currency',
                                        currency: 'EUR'
                                    })}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No expenses yet.</p>
                )}
            </section>
        </div>
    );
};

export default HomePage;