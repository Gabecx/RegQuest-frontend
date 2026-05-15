import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const baseURL = 'https://regquest-backend-2.onrender.com/api/v1';

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