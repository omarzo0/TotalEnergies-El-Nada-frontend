import { Oil, OilStorage, OilShift } from '../types/oils.types';

import { getHeaders } from "@/utils/api.utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const oilsApi = {
    // ── Master Data ──────────────────────────────────────
    getAllOils: async (): Promise<Oil[]> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/oils`, {
            headers: getHeaders()
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return Array.isArray(result.data) ? result.data : [];
    },

    addOil: async (data: { oilName: string; price: number; date: string }): Promise<Oil> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/oils`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    // ── Storage (Inventory) ──────────────────────────────
    getStorage: async (date: string): Promise<OilStorage[]> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/oils/storage/${date}`, {
            headers: getHeaders()
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            const msg = (result.message || "").toLowerCase();
            const isNoData = response.status === 404 || msg.includes("data") || msg.includes("بيانات");
            if (isNoData) return [];
            throw new Error(result.message);
        }

        return Array.isArray(result.data) ? result.data : [];
    },

    updateStorage: async (data: { date: string; oilName: string; startBalance: number; storageIncoming: number }): Promise<OilStorage> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/oils/storage`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    // ── Shift Sales ──────────────────────────────────────
    getShiftSales: async (date: string): Promise<OilShift[]> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/oils/shift/${date}`, {
            headers: getHeaders()
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            const msg = (result.message || "").toLowerCase();
            const isNoData = response.status === 404 || msg.includes("data") || msg.includes("بيانات");
            if (isNoData) return [];
            throw new Error(result.message);
        }

        return Array.isArray(result.data) ? result.data : [];
    },

    updateShiftSales: async (data: { date: string; oilName: string; firstTermBalance: number; endTermBalance: number; incoming: number }): Promise<OilShift> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/oils/shift`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    deleteStorage: async (id: string): Promise<boolean> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/oils/storage/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        const result = await response.json();
        return result.success;
    },

    deleteShiftSales: async (id: string): Promise<boolean> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/oils/shift/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        const result = await response.json();
        return result.success;
    }
};
