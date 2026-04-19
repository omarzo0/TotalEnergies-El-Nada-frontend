import { SystemLogEntry, LogFilters } from '../types/system-log.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = () => {
    let token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (token) {
        token = token.trim().replace(/^"(.*)"$/, '$1');
    }

    if (!token || token === "null" || token === "undefined" || token === "[object Object]") {
        console.warn("FrontEnd API (Logs): Token is missing or invalid!");
        return { "Content-Type": "application/json" };
    }

    const finalToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    return {
        "Content-Type": "application/json",
        "Authorization": finalToken
    };
};

export const systemLogApi = {
    // 1. Get Logs by Date with optional filters
    getLogsByDate: async (date: string, filters: Partial<Omit<LogFilters, 'date'>> = {}): Promise<SystemLogEntry[]> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const queryParams = new URLSearchParams();
        if (filters.email) queryParams.append('email', filters.email);
        if (filters.type && filters.type !== 'ALL') queryParams.append('type', filters.type);
        if (filters.category) queryParams.append('category', filters.category);

        const queryString = queryParams.toString();
        const url = `${API_URL}/logs/${date}${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            headers: getHeaders()
        });

        const result = await response.json();
        // Backend returns logs in result.data or similar
        // Adjusting based on standard pattern
        if (!result.success) throw new Error(result.message || "Failed to fetch logs");
        return result.data;
    },

    // 2. Get Logs by Admin Email
    getLogsByAdmin: async (email: string): Promise<SystemLogEntry[]> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/logs/admin/${encodeURIComponent(email)}`, {
            headers: getHeaders()
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to fetch admin logs");
        return result.data;
    }
};
