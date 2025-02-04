import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddExpensePage from './pages/AddExpensePage';
import EditExpensePage from './pages/EditExpensePage';
import ExpenseDetailPage from './pages/ExpenseDetailPage';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/add" element={<AddExpensePage />} />
                <Route path="/edit/:id" element={<EditExpensePage />} />
                <Route path="/expense/:id" element={<ExpenseDetailPage />} />
            </Routes>
        </Router>
    );
};

export default App;