import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restore session on app load
    useEffect(() => {
        const loadStoredUser = async () => {
            try {
                const token = await AsyncStorage.getItem('jwt_token');
                const storedUser = await AsyncStorage.getItem('user');

                if (token && storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Failed to restore session:", error);
                await logout();
            } finally {
                setIsLoading(false);
            }
        };

        loadStoredUser();
    }, []);

    // LOGIN
    const login = async (email, password) => {
        try {
            const response = await api.post('/accounts/login/', {
                email,
                password
            });

            const { access, refresh, user: userData } = response.data;

            if (!access) {
                throw new Error("No access token returned from backend");
            }

            await AsyncStorage.setItem('jwt_token', access);

            if (refresh) {
                await AsyncStorage.setItem('refresh_token', refresh);
            }

            if (userData) {
                await AsyncStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
            }

            router.replace('/(tabs)/home');

        } catch (error) {
            console.log("Login error:", error.response?.data || error.message);
            throw error;
        }
    };

    // LOGOUT
    const logout = async () => {
        try {
            await AsyncStorage.removeItem('jwt_token');
            await AsyncStorage.removeItem('refresh_token');
            await AsyncStorage.removeItem('user');
        } catch (error) {
            console.log("Logout error:", error.message);
        }

        setUser(null);
        router.replace('/auth/login');
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