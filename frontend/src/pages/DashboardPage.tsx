import React, { useState, useEffect } from 'react';
import { fetchExpenses } from '../api/expenseApi';
import { ExpenseDTO } from '../types/ExpenseDTO';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
    RadarController,
    RadialLinearScale,
    Filler,
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import styles from './DashboardPage.module.css';
import CategoryFilter from '../components/CategoryFilter';
import { useCategoryContext } from '../context/CategoryContext';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    BarElement,
    RadarController,
    RadialLinearScale,
    Filler,
    Title,
    Tooltip,
    Legend
);

type TimePeriod = 'day' | 'week' | 'month' | 'year';

const DashboardPage: React.FC = () => {
    const [expenses, setExpenses] = useState<ExpenseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const { categories } = useCategoryContext();

    useEffect(() => {
        fetchExpenses()
            .then(data => {
                setExpenses(data);
                setLoading(false);
            })
            .catch(err => {
                setError("Failed to fetch expenses");
                setLoading(false);
                console.error(err);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const getStartOfPeriod = (date: Date, period: TimePeriod): Date => {
        const newDate = new Date(date);
        switch (period) {
            case 'day': {
                newDate.setHours(0, 0, 0, 0);
                return newDate;
            }
            case 'week': {
                const dayOfWeek = newDate.getDay();
                const diff = newDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                newDate.setDate(diff);
                newDate.setHours(0, 0, 0, 0);
                return newDate;
            }
            case 'month': {
                newDate.setDate(1);
                newDate.setHours(0, 0, 0, 0);
                return newDate;
            }
            case 'year': {
                newDate.setMonth(0, 1);
                newDate.setHours(0, 0, 0, 0);
                return newDate;
            }
            default: {
                return newDate;
            }
        }
    };

    const filterExpensesByPeriod = (expenses: ExpenseDTO[], period: TimePeriod): ExpenseDTO[] => {
        const now = new Date();
        const startOfPeriod = getStartOfPeriod(now, period);

        return expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= startOfPeriod;
        });
    };

    const filterExpenses = (expenses: ExpenseDTO[], period: TimePeriod, selectedCategories: string[]): ExpenseDTO[] => {
        let filtered = filterExpensesByPeriod(expenses, period);

        if (selectedCategories.length > 0) {
            filtered = filtered.filter(expense => selectedCategories.includes(expense.category));
        }
        return filtered;
    };

    const filteredExpenses = filterExpenses(expenses, selectedPeriod, selectedCategories);
    const totalSpending = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    const prepareCategoryData = (expensesToUse: ExpenseDTO[] = filteredExpenses) => {
        const categoryData: { [key: string]: number } = {};
        expensesToUse.forEach(expense => {
            categoryData[expense.category] = (categoryData[expense.category] || 0) + expense.amount;
        });

        const labels = Object.keys(categoryData);
        const amounts = Object.values(categoryData);
        return { labels, amounts };
    };

    const prepareTimeData = (expensesToUse: ExpenseDTO[] = filteredExpenses) => {
        const dailySpending: { [key: string]: number } = {};
        expensesToUse.forEach(expense => {
            const dateStr = new Date(expense.date).toISOString().split('T')[0];
            dailySpending[dateStr] = (dailySpending[dateStr] || 0) + expense.amount;
        });

        const sortedDates = Object.keys(dailySpending).sort();
        const amounts = sortedDates.map(date => dailySpending[date]);
        return { labels: sortedDates, amounts };
    };

    const prepareRadarData = (currentPeriodExpenses: ExpenseDTO[], previousPeriodExpenses: ExpenseDTO[]) => {
        const currentCategoryData = prepareCategoryData(currentPeriodExpenses);
        const previousCategoryData = prepareCategoryData(previousPeriodExpenses);

        const allLabels = Array.from(new Set([...currentCategoryData.labels, ...previousCategoryData.labels]));

        return {
            labels: allLabels,
            datasets: [
                {
                    label: `Current ${selectedPeriod}`,
                    data: allLabels.map(cat => currentCategoryData.amounts[currentCategoryData.labels.indexOf(cat)] ?? 0),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
                {
                    label: `Previous ${selectedPeriod}`,
                    data: allLabels.map(cat => previousCategoryData.amounts[previousCategoryData.labels.indexOf(cat)] ?? 0),
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                },
            ],
        };
    };

    const categoryData = prepareCategoryData();
    const doughnutChartData = {
        labels: categoryData.labels,
        datasets: [{
            data: categoryData.amounts,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#83c5be', '#64a8a1', '#e27d60', '#488f31'],
            hoverBackgroundColor: ['#E65C77', '#2991DA', '#FFB945', '#41B6B6', '#8C52E5', '#FF8F30', '#74b6b0', '#56978f', '#d36848', '#367822'],
        }],
    };

    const timeData = prepareTimeData();
    const areaChartData = {
        labels: timeData.labels,
        datasets: [{
            label: 'Spending Over Time',
            data: timeData.amounts,
            fill: true,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
    };

    const barChartData = {
        labels: categoryData.labels,
        datasets: [{
            label: 'Spending by Category',
            data: categoryData.amounts,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        }],
    };

    const getPreviousPeriodExpenses = (currentPeriod: TimePeriod, expenses: ExpenseDTO[]): ExpenseDTO[] => {
        const now = new Date();
        let startOfPreviousPeriod: Date;

        switch (currentPeriod) {
            case 'day': {
                startOfPreviousPeriod = new Date(now.setDate(now.getDate() - 1));
                break;
            }
            case 'week': {
                startOfPreviousPeriod = new Date(now.setDate(now.getDate() - 7));
                break;
            }
            case 'month': {
                startOfPreviousPeriod = new Date(now.setMonth(now.getMonth() - 1));
                break;
            }
            case 'year': {
                startOfPreviousPeriod = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            }
            default: {
                startOfPreviousPeriod = new Date();
            }
        }
        const startOfPeriod = getStartOfPeriod(startOfPreviousPeriod, currentPeriod);
        return expenses.filter(expense => new Date(expense.date) >= startOfPeriod && new Date(expense.date) < getStartOfPeriod(now, currentPeriod));
    };

    const previousPeriodExpenses = getPreviousPeriodExpenses(selectedPeriod, expenses);
    const radarChartData = prepareRadarData(filteredExpenses, previousPeriodExpenses);

    const handleCategoryChange = (newSelectedCategories: string[]) => {
        setSelectedCategories(newSelectedCategories);
    };

    return (
        <div className={styles.dashboardPage}>
            <div className={styles.header}>
                <div className={styles.totalSpending}>
                    Total: €{totalSpending.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={styles.periodSelection}>
                    <button
                        onClick={() => setSelectedPeriod('day')}
                        className={selectedPeriod === 'day' ? styles.active : ''}
                    >
                        Day
                    </button>
                    <button
                        onClick={() => setSelectedPeriod('week')}
                        className={selectedPeriod === 'week' ? styles.active : ''}
                    >
                        Week
                    </button>
                    <button
                        onClick={() => setSelectedPeriod('month')}
                        className={selectedPeriod === 'month' ? styles.active : ''}
                    >
                        Month
                    </button>
                    <button
                        onClick={() => setSelectedPeriod('year')}
                        className={selectedPeriod === 'year' ? styles.active : ''}
                    >
                        Year
                    </button>
                </div>
            </div>

            <div className={styles.filterAndCharts}>
                <CategoryFilter
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onCategoryChange={handleCategoryChange}
                />
                <div className={styles.chartsGrid}>
                    <div className={styles.chartContainer}>
                        <h3>Spending Over Time</h3>
                        <Line data={areaChartData} />
                    </div>
                    <div className={styles.chartContainer}>
                        <h3>Category Breakdown</h3>
                        <Doughnut data={doughnutChartData} />
                    </div>
                    <div className={styles.chartContainer}>
                        <h3>Category Comparison</h3>
                        <Radar data={radarChartData} />
                    </div>
                    <div className={styles.chartContainer}>
                        <h3>Spending by Category</h3>
                        <Bar data={barChartData}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
