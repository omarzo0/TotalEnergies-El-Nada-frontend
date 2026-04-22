import { DeferredClientPayment, TermClientResponse } from '../types/deferred-clients.types';

import { getHeaders } from "@/utils/api.utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const deferredClientsApi = {
    getPaymentsByDate: async (date: string): Promise<TermClientResponse> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/term-clients/${date}`, {
            headers: getHeaders()
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            const msg = (result.message || "").toLowerCase();
            const isNoData = response.status === 404 || msg.includes("data") || msg.includes("بيانات");
            if (isNoData) return { data: [], total: 0 };
            throw new Error(result.message);
        }

        // Backend returns data in result.data which is an array [ { data: [], total: 0 } ]
        const mainData = Array.isArray(result.data) ? result.data[0] : result.data;

        return {
            data: mainData?.data || [],
            total: mainData?.total || 0
        };
    },

    addPayment: async (data: Partial<DeferredClientPayment>): Promise<DeferredClientPayment> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/term-clients`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    updatePayment: async (id: string, data: Partial<DeferredClientPayment>): Promise<DeferredClientPayment> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/term-clients/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    deletePayment: async (id: string): Promise<boolean> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/term-clients/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        const result = await response.json();
        return result.success;
    }
};
