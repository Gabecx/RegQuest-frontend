import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1/';

const api = axios.create({
    baseURL,
});

api.interceptors.request.use(
    (config) => {
        const jwt_token = localStorage.getItem("jwt_token");
        if (jwt_token) {
            config.headers['Authorization'] = `Bearer ${jwt_token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
           if (originalRequest.url === '/accounts/login/' || originalRequest.url === '/accounts/login/refresh/') {
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                window.location.href = '/'; 
                return Promise.reject(error);
           }
           originalRequest._retry = true;
           const refreshToken = localStorage.getItem("refresh_token");

           if (refreshToken) {
                try {
                    const response = await axios.post(`${baseURL}accounts/login/refresh/`, {
                        refresh: refreshToken
                    });

                    const newAccessToken = response.data.access;
                    localStorage.setItem("jwt_token", newAccessToken);

                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (error) {
                    console.error("Token refresh failed. Session expired.");
                    localStorage.removeItem('jwt_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user');
                    window.location.href = '/';
                }
           } else {
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                window.location.href = '/';
           }
        }
        return Promise.reject(error);
    }
);

export default api;