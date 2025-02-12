import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './global.css';
import { CategoryProvider } from './context/CategoryContext';
import { ExpenseProvider } from './context/ExpenseContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <CategoryProvider>
            <ExpenseProvider>
                <App />
            </ExpenseProvider>
        </CategoryProvider>
    </React.StrictMode>,
)