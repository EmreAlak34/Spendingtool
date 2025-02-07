import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CategoryDTO } from '../types/CategoryDTO';

const CategoryTest: React.FC = () => {
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                console.log("Fetching categories from: http://localhost:8080/api/categories");
                const response = await axios.get<CategoryDTO[]>('http://localhost:8080/api/categories');
                console.log("Category data received:", response.data);
                setCategories(response.data);
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    console.error("Axios error:", err.response?.data);
                    setError("Axios Error: " + (err.response?.data || err.message));
                } else if (err instanceof Error) {
                    console.error("Generic error:", err.message);
                    setError("Error: " + err.message);
                } else {
                    console.error("Unknown error:", err);
                    setError("Unknown Error");
                }
            }
        };

        fetchCategoryData();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Category Test</h1>
            <ul>
                {categories.map(category => (
                    <li key={category.id}>{category.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryTest;