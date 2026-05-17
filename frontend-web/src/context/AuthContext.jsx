import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Session Persistence
    useEffect(() => {
        const loadStoredUser = () => {
            try {
                const token = localStorage.getItem('jwt_token');
                const storedUser = localStorage.getItem('user');

                if (token && storedUser && storedUser !== "undefined") {
                    const parsed = JSON.parse(storedUser);
                    if (parsed.email && parsed.first_name === undefined && parsed.role) {
                        // Stale payload format, force logout to get new data
                        logout();
                    } else {
                        setUser(parsed);
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Failed to restore session", error);
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadStoredUser();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/accounts/login/', {
            email,
            password
        });

        const { access, refresh, user: userData } = response.data;

        localStorage.setItem('jwt_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);

        navigate('/home');
    };

    const logout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    const value = {
        user,
        isLoading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};
