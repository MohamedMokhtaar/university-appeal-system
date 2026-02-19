/**
 * Auth Utilities for Thesis Project
 */

const AUTH_KEY = 'auth_user';

export const setUser = (user) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
};

export const getUser = () => {
    const userJson = localStorage.getItem(AUTH_KEY);
    return userJson ? JSON.parse(userJson) : null;
};

export const clearUser = () => {
    localStorage.removeItem(AUTH_KEY);
};

export const logout = () => {
    clearUser();
    window.location.href = '/login';
};

/**
 * Maps role_name string exactly as in DB to the correct dashboard path
 */
export const getRedirectPath = (role_name) => {
    switch (role_name) {
        case 'SuperAdmin': return '/admin';
        case 'HeadOfExam': return '/hoe';
        case 'Faculty': return '/faculty';
        case 'Teacher': return '/teacher';
        default: return '/';
    }
};
