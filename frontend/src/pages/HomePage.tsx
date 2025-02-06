
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Home</h1>
            <button onClick={() => navigate('/add-expense')} style={{ marginRight: '10px' }}>
                Add Expense
            </button>
            <button onClick={() => navigate('/categories')} style={{ marginRight: '10px' }}>
                Categories
            </button>
        </div>
    );
};

export default HomePage;