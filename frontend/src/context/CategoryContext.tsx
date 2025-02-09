import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { CategoryDTO } from '../types/CategoryDTO';
import { fetchCategories } from '../api/expenseApi';
import { categories as initialCategories } from '../constants';
import axios from 'axios';

interface CategoryContextProps {
    categories: CategoryDTO[];
    setCategories: React.Dispatch<React.SetStateAction<CategoryDTO[]>>;
    favoriteCategoryIds: string[];
    setFavoriteCategoryIds: React.Dispatch<React.SetStateAction<string[]>>;
    isLoadingCategories: boolean;
    error: string | null;
    fetchCategoriesData: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextProps | undefined>(undefined);

interface CategoryProviderProps {
    children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [favoriteCategoryIds, setFavoriteCategoryIds] = useState<string[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const savedFavorites = localStorage.getItem('favoriteCategories');
        if (savedFavorites) {
            try {
                setFavoriteCategoryIds(JSON.parse(savedFavorites));
            } catch (error) {
                console.error("Error parsing favorite categories from localStorage:", error);

            }
        }
    }, []);


    useEffect(() => {
        localStorage.setItem('favoriteCategories', JSON.stringify(favoriteCategoryIds));
    }, [favoriteCategoryIds]);


    const fetchCategoriesData = async () => {
        setIsLoadingCategories(true);
        setError(null);
        try {
            const fetchedCategories = await fetchCategories();
            const fetchedCategoryNames = new Set(fetchedCategories.map(cat => cat.name));
            const allCategories = [
                ...fetchedCategories,
                ...initialCategories
                    .filter(initialCategory => !fetchedCategoryNames.has(initialCategory))
                    .map(initialCategory => ({ id: initialCategory, name: initialCategory })),
            ];
            allCategories.sort((a,b) => a.name.localeCompare(b.name));
            setCategories(allCategories);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {

                setError(err.response?.data || "Failed to fetch categories (Axios error)");
                console.error("Axios error:", err.response?.data);
            } else if (err instanceof Error) {

                setError(err.message);
                console.error("Error fetching categories:", err.message);
            } else {

                setError("Failed to fetch categories (unknown error)");
                console.error("Unknown error fetching categories:", err);
            }
        } finally {
            setIsLoadingCategories(false);
        }
    };
    useEffect(() => {
        fetchCategoriesData();
    }, []);


    const contextValue = {
        categories,
        setCategories,
        favoriteCategoryIds,
        setFavoriteCategoryIds,
        isLoadingCategories,
        error,
        fetchCategoriesData
    };

    return (
        <CategoryContext.Provider value={contextValue}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategoryContext = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategoryContext must be used within a CategoryProvider');
    }
    return context;

};