import { useState, useEffect } from "react";
import api from "../api/axios";
export function useRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await api.get("/requests/");
            setRequests(response.data || []);
            setError(null);
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Session expired. Please log in again.");
            } else {
                if (process.env.NODE_ENV === 'development') {
                    console.error("Request Error:", err.message);
                }
                setError("Failed to load data. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchRequests();
    }, []);

    return { requests, loading, error, refetchRequests: fetchRequests };
}