import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedAtomLoader from './AnimatedAtomLoader';

interface ProtectedRouteProps {
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { currentUser, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-dark">
                <AnimatedAtomLoader />
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

export default ProtectedRoute;
