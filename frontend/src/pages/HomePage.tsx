import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import { useExpenseContext } from '../context/ExpenseContext';
import { useCategoryContext } from '../context/CategoryContext';
import { FaPlusCircle } from 'react-icons/fa'; // Import an icon

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { expenses } = useExpenseContext();
    const { categories } = useCategoryContext();

    // Filter expenses for the current month
    const getCurrentMonthExpenses = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        });
    };

    const currentMonthExpenses = getCurrentMonthExpenses();
    const totalSpendingThisMonth = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);


    // Calculate spending per category (for the current month)
    const categoryData = useMemo(() => {  // useMemo for efficiency
        const categorySpending: { [key: string]: number } = {};
        const validExpenses = currentMonthExpenses.filter(expense =>
            categories.some(cat => cat.name === expense.category)
        );
        validExpenses.forEach(expense => {
            categorySpending[expense.category] = (categorySpending[expense.category] || 0) + expense.amount;
        });

        // Convert to array of objects for easier display in the table
        const spendingArray = Object.entries(categorySpending).map(([category, amount]) => ({
            category,
            amount,
        }));

        return spendingArray;
    }, [currentMonthExpenses, categories]);


    // Get the last 5 expenses, sorted by date (descending)
    const recentExpenses = useMemo(() => {
        return [...expenses]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5); // Limit to 5
    }, [expenses]);


    return (
        <div className={styles.homePage}>
            <section className={styles.heroSection}>
                <h1>Welcome to Spending Harmony!</h1>
                <p>Your personal expense tracker for a clearer financial picture.</p>
                <button
                    onClick={() => navigate('/add-expense')}
                    className={styles.addButton}
                >
                    <FaPlusCircle className={styles.icon} /> Add Expense
                </button>
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
                            <td>{amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>

                        </tr>

                    ))}
                    {/* Total Row */}
                    <tr>
                        <td><strong>Total</strong></td>
                        <td><strong>{totalSpendingThisMonth.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</strong></td>

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
                                <span className={styles.expenseDate}>{new Date(expense.date).toLocaleDateString()}</span>
                                <span className={styles.expenseDescription}>{expense.description}</span>
                                <span className={styles.expenseAmount}>
                                    {expense.amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
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