
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css'

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.homePage}>

            <button onClick={() => navigate('/add-expense')} >
                Add Expense
            </button>
            <button onClick={() => navigate('/categories')}>
                Categories
            </button>
        </div>
    );
};

export default HomePage;