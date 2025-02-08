import React from 'react';
import { CategoryDTO } from '../types/CategoryDTO';
import styles from './CategoryFilter.module.css';

interface CategoryFilterProps {
    categories: CategoryDTO[];
    selectedCategories: string[];
    onCategoryChange: (categories: string[]) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
                                                           categories,
                                                           selectedCategories,
                                                           onCategoryChange,
                                                       }) => {
    const handleCheckboxChange = (categoryName: string) => {
        const updatedSelection = selectedCategories.includes(categoryName)
            ? selectedCategories.filter((cat) => cat !== categoryName)
            : [...selectedCategories, categoryName];
        onCategoryChange(updatedSelection);
    };
    const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className={styles.categoryFilter}>
            <h4>Filter by Category</h4>
            <div className={styles.checkboxes}>

                {sortedCategories.map((category) => (
                    <div key={category.id} className={styles.checkboxItem}>
                        <label >
                            <input
                                type="checkbox"
                                value={category.name}
                                checked={selectedCategories.includes(category.name)}
                                onChange={() => handleCheckboxChange(category.name)}
                            />
                            {category.name}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilter;