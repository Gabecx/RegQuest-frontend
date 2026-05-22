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
        const status = error.response?.status;

        if (status === 401) {
            try {
                await AsyncStorage.removeItem('jwt_token');
                await AsyncStorage.removeItem('refresh_token');
                await AsyncStorage.removeItem('user');
            } catch (e) {
                console.log("Storage clear error:", e);
            }

            // safer navigation check
            if (router?.replace) {
                router.replace('/auth/login');
            }
        }

        return Promise.reject(error);
    }
);

export default api;