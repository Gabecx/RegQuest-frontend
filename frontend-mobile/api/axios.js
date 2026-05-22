import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// For local development on a physical device, use your machine's IP address
// Also make sure Django is running via: python manage.py runserver 0.0.0.0:8000
const baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://10.36.28.251:8000/api/v1';

const api = axios.create({
    baseURL,
    timeout: 15000,
});


api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem("jwt_token");

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        } catch (error) {
            return config;
        }
    },
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (originalRequest.url === '/accounts/login/' || originalRequest.url === '/accounts/login/refresh/') {
                try {
                    await AsyncStorage.removeItem('jwt_token');
                    await AsyncStorage.removeItem('refresh_token');
                    await AsyncStorage.removeItem('user');
                } catch (e) {
                    console.log("Storage clear error:", e);
                }
                if (router?.replace) {
                    router.replace('/auth/login');
                }
                return Promise.reject(error);
            }
            originalRequest._retry = true;
            try {
                const refreshToken = await AsyncStorage.getItem('refresh_token');
                
                if (refreshToken) {
                    const response = await axios.post(`${baseURL}/accounts/login/refresh/`, {
                        refresh: refreshToken
                    });
                    const newAccessToken = response.data.access;
                    await AsyncStorage.setItem('jwt_token', newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } else {
                    throw new Error("No refresh token available");
                }
            } catch (refreshError) {
                console.log("Token refresh failed. Session expired.");
                try {
                    await AsyncStorage.removeItem('jwt_token');
                    await AsyncStorage.removeItem('refresh_token');
                    await AsyncStorage.removeItem('user');
                } catch (e) {
                    console.log("Storage clear error:", e);
                }
                if (router?.replace) {
                    router.replace('/auth/login');
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;