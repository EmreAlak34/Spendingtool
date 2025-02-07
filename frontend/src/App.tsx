
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddExpensePage from './pages/AddExpensePage';
import EditExpensePage from './pages/EditExpensePage';
import CategoriesPage from './pages/CategoriesPage';
import styles from './App.module.css';

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
        </nav>
    );
}

export default App;