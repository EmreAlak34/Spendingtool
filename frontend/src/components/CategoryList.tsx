
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './CategoryList.module.css';

interface CategoryListProps {
    onSelect: (category: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ onSelect }) => {
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await axios.get('/api/expenses/categories');
            setCategories(response.data);
        };
        fetchCategories();
    }, []);

    return (
        <div className={styles.categoryList}>
            <h2>Categories</h2>
            <ul>
                {categories.map((category) => (
                    <li key={category}>
                        <button onClick={() => onSelect(category)}>
                            {category}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;
