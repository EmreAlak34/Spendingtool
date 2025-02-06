
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddExpensePage from './pages/AddExpensePage';
import EditExpensePage from './pages/EditExpensePage';
import CategoriesPage from './pages/CategoriesPage';

const App: React.FC = () => {
    return (
        <Router>
            <nav>
                <Link to="/">Home</Link>
            </nav>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/add-expense" element={<AddExpensePage />} />
                <Route path="/edit-expense/:id" element={<EditExpensePage />} /> {/* Add this route */}
                <Route path="/categories" element={<CategoriesPage />} />
            </Routes>
        </Router>
    );
};

export default App;