import {
    SupplyBookRecord,
    MonthlyBalanceResponse,
    StandardGaugesResponse,
    StandardUpdatePayload
} from '../types/supply-book.types';

import { getHeaders } from "@/utils/api.utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const supplyBookApi = {
    // 1. GET /api/supply-book/:date — daily records with optional benzType filter
    getRecordsByDate: async (date: string, benzType?: string): Promise<SupplyBookRecord[]> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        let url = `${API_URL}/supply-book/${date}`;
        if (benzType) url += `?benzType=${encodeURIComponent(benzType)}`;

        const response = await fetch(url, { headers: getHeaders() });
        const result = await response.json();

        if (!response.ok || !result.success) {
            const msg = (result.message || "").toLowerCase();
            const isNoData = response.status === 404 || msg.includes("data") || msg.includes("بيانات");
            if (isNoData) return [];
            throw new Error(result.message);
        }

        return result.data || [];
    },

    // 2. POST /api/supply-book — create record
    createRecord: async (data: Partial<SupplyBookRecord>): Promise<SupplyBookRecord> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/supply-book`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    // 3. PUT /api/supply-book — update full record
    updateRecord: async (data: Partial<SupplyBookRecord>): Promise<SupplyBookRecord> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const id = data._id || data.id;
        const response = await fetch(`${API_URL}/supply-book/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });


        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    // 4. PUT /api/supply-book/standard — update gauges for all 4 fuel types
    updateStandard: async (data: StandardUpdatePayload): Promise<boolean> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/supply-book/standard`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return true;
    },

    // 5. GET /api/supply-book/balance/:month — monthly balance
    getMonthlyBalance: async (month: number): Promise<MonthlyBalanceResponse> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/supply-book/balance/${month}`, {
            headers: getHeaders()
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            const msg = (result.message || "").toLowerCase();
            const isNoData = response.status === 404 || msg.includes("data") || msg.includes("بيانات");
            if (isNoData) return {};
            throw new Error(result.message);
        }

        const data = Array.isArray(result.data) ? result.data[0] : result.data;
        return data || {};
    },

    // 6. GET /api/supply-book/standard/:date — get gauges by date
    getStandardByDate: async (date: string): Promise<StandardGaugesResponse> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/supply-book/standard/${date}`, {
            headers: getHeaders()
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            const msg = (result.message || "").toLowerCase();
            const isNoData = response.status === 404 || msg.includes("data") || msg.includes("بيانات");
            if (isNoData) return {};
            throw new Error(result.message);
        }

        const data = Array.isArray(result.data) ? result.data[0] : result.data;
        return data || {};
    },

    // 7. DELETE /api/supply-book/:id — delete single record
    deleteRecord: async (id: string): Promise<boolean> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/supply-book/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        const result = await response.json();
        return result.success;
    },

    // 8. DELETE /api/supply-book/balance/:month — delete monthly records
    deleteBalance: async (month: number, benzType?: string): Promise<number> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        let url = `${API_URL}/supply-book/balance/${month}`;
        if (benzType) url += `?benzType=${encodeURIComponent(benzType)}`;

        const response = await fetch(url, {
            method: 'DELETE',
            headers: getHeaders()
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data?.deletedCount || 0;
    },

    // 9. DELETE /api/supply-book/standard/:date — reset gauges
    resetStandard: async (date: string): Promise<boolean> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/supply-book/standard/${date}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        const result = await response.json();
        return result.success;
    }
};
