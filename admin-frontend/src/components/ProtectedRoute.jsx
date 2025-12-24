import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from './ui/LoadingSpinner';

const ProtectedRoute = ({ children, requireSuperAdmin = false }) => {
    const { user, isAuthenticated, isLoading, isSuperAdmin, isAdmin } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <PageLoader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isAdmin && !isSuperAdmin) {
        // Technically shouldn't happen due to login check, but just in case
        return <Navigate to="/login" replace />;
    }

    if (requireSuperAdmin && !isSuperAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
