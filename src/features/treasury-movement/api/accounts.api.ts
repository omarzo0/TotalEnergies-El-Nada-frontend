import { Account, AccountFormData, AccountSearchFilters } from '../types/treasury-movement.types';

import { getHeaders } from "@/utils/api.utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const accountsApi = {
    // 1. GET /api/accounts/:date?name=...
    getAccounts: async (filters: AccountSearchFilters): Promise<Account[]> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const { date, name } = filters;
        let url = `${API_URL}/accounts/${date}`;

        if (name) {
            url += `?name=${encodeURIComponent(name)}`;
        }

        const response = await fetch(url, {
            headers: getHeaders()
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            const msg = (result.message || "").toLowerCase();
            const isNoData = response.status === 404 || msg.includes("data") || msg.includes("بيانات");
            if (isNoData) return [];
            throw new Error(result.message || "Failed to fetch accounts");
        }

        // Handle nested structure if applicable (similar to treasury-movement)
        if (Array.isArray(result.data) && result.data[0]?.data && Array.isArray(result.data[0].data)) {
            return result.data[0].data;
        }

        return Array.isArray(result.data) ? result.data : [];
    },

    // 2. POST /api/accounts
    createAccount: async (data: AccountFormData): Promise<Account> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/accounts`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to create account entry");
        return result.data;
    },

    // 3. PUT /api/accounts/:id
    updateAccount: async (id: string, data: AccountFormData): Promise<Account> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/accounts/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to update account entry");
        return result.data;
    },

    // 4. DELETE /api/accounts/:id
    deleteAccount: async (id: string): Promise<boolean> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/accounts/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        const result = await response.json();
        return result.success;
    }
};
