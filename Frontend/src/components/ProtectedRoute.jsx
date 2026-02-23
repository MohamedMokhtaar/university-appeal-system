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
    const isAdmin = user.role_name === 'Admin' || user.role_name === 'SuperAdmin';
    const allowedRoles = Array.isArray(allowedRoleName) ? allowedRoleName : (allowedRoleName ? [allowedRoleName] : []);
    if (!isAdmin && allowedRoles.length > 0 && !allowedRoles.includes(user.role_name)) {
        console.warn(`Access Denied. Required Role: ${allowedRoles.join(', ')}. Current Role: ${user.role_name}`);
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
