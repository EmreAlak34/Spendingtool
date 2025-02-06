
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddExpensePage from './pages/AddExpensePage';
import EditExpensePage from './pages/EditExpensePage';
import CategoriesPage from './pages/CategoriesPage';

const App: React.FC = () => {
    return (
        <Router>
            <AppNavigation />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/add-expense" element={<AddExpensePage />} />
                <Route path="/edit-expense/:id" element={<EditExpensePage />} />
                <Route path="/categories" element={<CategoriesPage />} />
            </Routes>
        </Router>
    );
};


const AppNavigation: React.FC = () => {
    const location = useLocation();

    // Check if the current path is NOT the homepage, categories, or add-expense
    const showHomeLink = location.pathname !== "/" && !location.pathname.startsWith("/categories") && location.pathname !== "/add-expense";

    return (
        <nav>
            {showHomeLink && (
                <Link to="/">Home</Link>
            )}
        </nav>
    );
}

export default App;