import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';


export default function ProtectedRoutes() {
    const { user, loading } = useAuthContext();

    if (loading) {
        return <div>Loading...</div>; // Or a more sophisticated loading spinner
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
}