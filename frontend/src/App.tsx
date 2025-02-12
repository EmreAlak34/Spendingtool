import React from 'react';
import { BrowserRouter as Router, Routes, Route,  NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddExpensePage from './pages/AddExpensePage';
import EditExpensePage from './pages/EditExpensePage';
import CategoriesPage from './pages/CategoriesPage';
import DashboardPage from './pages/DashboardPage';
import styles from './App.module.css';
import {  FaChartLine, FaPlus, FaList, FaHome } from 'react-icons/fa';


const App: React.FC = () => {


    return (
        <Router>
            <div className={styles.appWrapper}>
                <nav className={styles.sidebar}>
                    <AppNavigation />
                </nav>

                <div className={styles.contentWrapper}>

                    <header className={styles.appHeader}>
                        <h1>Spending Harmony</h1>
                    </header>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/add-expense" element={<AddExpensePage />} />
                        <Route path="/edit-expense/:id" element={<EditExpensePage />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};



const AppNavigation: React.FC = () => { // No props needed

    return(
        <>
            <NavLink to="/" className={({isActive}) => `${styles.sidebarLink} ${isActive? styles.active : ''}`}>
                <FaHome style={{ marginRight: '5px' }} /> Home
            </NavLink>
            <NavLink to="/add-expense" className={({isActive}) => `${styles.sidebarLink} ${isActive? styles.active : ''}`}>
                <FaPlus style={{ marginRight: '5px' }} /> Add Expense
            </NavLink>
            <NavLink to="/categories" className={({isActive}) => `${styles.sidebarLink} ${isActive? styles.active : ''}`}>
                <FaList style={{ marginRight: '5px' }} /> Categories
            </NavLink>
            <NavLink to="/dashboard" className={({isActive}) => `${styles.sidebarLink} ${isActive? styles.active : ''}`}>
                <FaChartLine style={{ marginRight: '5px' }} />Dashboard
            </NavLink>
        </>
    );
};

export default App;