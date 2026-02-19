import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUser } from '../utils/auth';

const ProtectedRoute = ({ children, allowedRoleName }) => {
    const user = getUser();

    // 1. Check if logged in
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // 2. Check Role Name string match
    if (allowedRoleName && user.role_name !== allowedRoleName) {
        console.warn(`Access Denied. Required Role: ${allowedRoleName}. Current Role: ${user.role_name}`);
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
