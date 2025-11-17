// src/hooks/useAdmin.js
import { useState, useEffect, useCallback } from 'react';

export const useAdmin = () => {
    const [isAdminVisible, setIsAdminVisible] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleKeyPress = useCallback((event) => {
        if (event.ctrlKey && event.altKey && event.shiftKey && event.code === 'F12') {
            event.preventDefault();
            setIsAdminVisible(prev => !prev);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    const login = (password) => {
        if (password === 'admin') {
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setIsAdminVisible(false);
    };

    const closeAdmin = () => {
        setIsAdminVisible(false);
    };

    return {
        isAdminVisible,
        isAuthenticated,
        login,
        logout,
        closeAdmin,
        showAdmin: () => setIsAdminVisible(true)
    };
};