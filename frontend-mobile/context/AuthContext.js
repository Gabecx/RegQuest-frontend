import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStoredUser = async () => {
            try {
                const token = await SecureStore.getItemAsync('jwt_token');
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

    const login = async (email, password) => {
        try {
            const tokenResponse = await api.post('/accounts/login/', {
                email,
                password
            });
            const { access, refresh } = tokenResponse.data;
            if (!access) {
                throw new Error("No access token returned from backend");
            }
            
            // Fetch user data FIRST
            const userResponse = await api.get('/accounts/users/me/', {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            });
            const userData = userResponse.data;
            
            // Only persist to storage if BOTH requests succeed
            await SecureStore.setItemAsync('jwt_token', access);
            if (refresh) {
                await SecureStore.setItemAsync('refresh_token', refresh);
            }
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            
            setUser(userData);
            router.replace('/(tabs)/home');
        } catch (error) {
            console.log("Login error:", error.response?.data || error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const refreshToken = await SecureStore.getItemAsync('refresh_token');
            if (refreshToken) {
                try {
                    await api.post('/accounts/logout/', { refresh: refreshToken });
                } catch (e) {
                    console.log("Backend logout error:", e.message);
                }
            }
            await SecureStore.deleteItemAsync('jwt_token');
            await SecureStore.deleteItemAsync('refresh_token');
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