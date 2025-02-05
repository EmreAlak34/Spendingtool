import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddExpensePage from './pages/AddExpensePage';
import EditExpensePage from './pages/EditExpensePage';
import ExpenseDetailPage from './pages/ExpenseDetailPage';
import styles from './App.module.css';

const App: React.FC = () => {
    return (
        <Router>
            <nav className={styles.navbar}>
                <Link to="/" className={styles.navButton}>
                    🏠 Home
                </Link>
                <Link to="/expenses" className={styles.navButton}>
                    📄 View Expenses
                </Link>
            </nav>
            <div className={styles.app}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/expenses" element={<HomePage />} />
                    <Route path="/add" element={<AddExpensePage />} />
                    <Route path="/edit/:id" element={<EditExpensePage />} />
                    <Route path="/expense/:id" element={<ExpenseDetailPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;