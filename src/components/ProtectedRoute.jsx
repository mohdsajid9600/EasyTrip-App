import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLoader from './ui/AppLoader';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, role, profile, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <AppLoader text="Verifying authentication..." />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />; // Or forbidden page
    }

    // Customer Profile Check
    if (role === 'CUSTOMER') {
        const isCreateProfilePage = location.pathname === '/customer/create-profile';

        if (!profile && !isCreateProfilePage) {
            // If customer has no profile and is not on create profile page, redirect them
            return <Navigate to="/customer/create-profile" replace />;
        }

        if (profile && isCreateProfilePage) {
            // If customer has profile but tries to access create profile page, redirect to dashboard
            return <Navigate to="/customer/dashboard" replace />;
        }
    }

    // Driver Profile Check
    if (role === 'DRIVER') {
        const isCreateProfilePage = location.pathname === '/driver/create-profile';

        if (!profile && !isCreateProfilePage) {
            // If driver has no profile and is not on create profile page, redirect to create profile
            return <Navigate to="/driver/create-profile" replace />;
        }

        if (profile && isCreateProfilePage) {
            // If driver has profile but tries to access create profile page, redirect to dashboard
            return <Navigate to="/driver/dashboard" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
