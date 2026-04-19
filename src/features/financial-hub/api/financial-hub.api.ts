import { DailyFinancialSummary, PeriodicFinancialReport } from "../types/financial-hub.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = () => {
    let token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (token) {
        token = token.trim().replace(/^"(.*)"$/, '$1');
    }

    if (!token || token === "null" || token === "undefined") {
        return { "Content-Type": "application/json" };
    }

    const finalToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    return {
        "Content-Type": "application/json",
        "Authorization": finalToken
    };
};

export const financialHubApi = {
    getDailySummary: async (date: string): Promise<DailyFinancialSummary> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/financial/summary/${date}`, {
            headers: getHeaders()
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to fetch daily summary");

        // Handle array response based on example
        if (Array.isArray(result.data)) {
            return result.data[0];
        }
        return result.data;
    },

    getPeriodicReport: async (start: string, end: string): Promise<PeriodicFinancialReport> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/financial/report?start=${start}&end=${end}`, {
            headers: getHeaders()
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to fetch periodic report");

        // Handle array response based on example
        if (Array.isArray(result.data)) {
            return result.data[0];
        }
        return result.data;
    }
};
