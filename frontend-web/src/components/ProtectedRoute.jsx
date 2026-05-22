import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {

        if (user.role === 'student') {
            return <Navigate to="/student/home" replace />;
        }

        if (user.role === 'staff') {
            return <Navigate to="/staff/dashboard" replace />;
        }

        if (user.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;