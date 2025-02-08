import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddExpensePage from './pages/AddExpensePage';
import EditExpensePage from './pages/EditExpensePage';
import CategoriesPage from './pages/CategoriesPage';
import DashboardPage from './pages/DashboardPage';
import styles from './App.module.css';
import { FaChartLine } from 'react-icons/fa';

const App: React.FC = () => {
    return (
        <Router>
            <div className={styles.appWrapper}>
                <AppNavigation />
                <div className={styles.contentWrapper}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/add-expense" element={<AddExpensePage />} />
                        <Route path="/edit-expense/:id" element={<EditExpensePage />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

const AppNavigation: React.FC = () => {
    return (
        <nav className={styles.navbar}>
            <Link to="/" className={styles.navLink}>Spending Harmony</Link>
            <Link to="/dashboard" className={styles.navLink}>
                <FaChartLine style={{ marginRight: '5px' }} />
                Dashboard
            </Link>
        </nav>
    );
}

export default App;