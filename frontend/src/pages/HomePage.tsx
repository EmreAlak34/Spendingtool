
import React, { useState } from 'react';
import ExpenseList from '../components/ExpenseList';
import CategoryList from '../components/CategoryList';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

    return (
        <div className={styles.homePage}>
            <div className={styles.leftPane}>
                <CategoryList onSelect={(cat) => setSelectedCategory(cat)} />
            </div>
            <div className={styles.rightPane}>
                <ExpenseList category={selectedCategory} />
            </div>
        </div>
    );
};

export default HomePage;
