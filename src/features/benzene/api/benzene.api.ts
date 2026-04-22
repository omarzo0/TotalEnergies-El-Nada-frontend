import { BenzenePrices, BenzenePumpReading, BenzeneTotals } from '../types/benzene.types';

import { getHeaders } from "@/utils/api.utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const benzeneApi = {
    // ── Prices ──────────────────────────────────────────
    getPrices: async (date: string): Promise<BenzenePrices> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/benzene/prices/${date}`, {
            headers: getHeaders()
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            const msg = (result.message || "").toLowerCase();
            const isNoData = response.status === 404 ||
                msg.includes("data") ||
                msg.includes("بيانات") ||
                msg.includes("found") ||
                msg.includes("not");

            if (isNoData) {
                console.warn(`benzeneApi: No price data for ${date} (Status ${response.status})`);
                return { solarPrice: 0, ben80Price: 0, ben92Price: 0, ben95Price: 0 };
            }
            throw new Error(result.message || `API Error: ${response.status}`);
        }

        // Handle array or object response
        const data = Array.isArray(result.data) ? result.data[0] : result.data;

        if (!data || Object.keys(data).length === 0) {
            console.warn(`benzeneApi: Data is empty for ${date}, returning zeros.`);
            return { solarPrice: 0, ben80Price: 0, ben92Price: 0, ben95Price: 0 };
        }

        return {
            solarPrice: data.solarPrice || 0,
            ben80Price: data.ben80Price || 0,
            ben92Price: data.ben92Price || 0,
            ben95Price: data.ben95Price || 0
        };
    },

    updatePrices: async (date: string, data: BenzenePrices): Promise<BenzenePrices> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        // Include date in the payload to ensure consistency
        const payload = { ...data, date };

        const response = await fetch(`${API_URL}/benzene/prices/${date}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);

        const returnData = Array.isArray(result.data) ? result.data[0] : result.data;
        return returnData;
    },

    deletePrices: async (date: string): Promise<boolean> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/benzene/prices/${date}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return true;
    },

    // ── Pump Readings ───────────────────────────────────
    getPumpReadings: async (date: string): Promise<BenzenePumpReading[]> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/benzene/${date}`, {
            headers: getHeaders()
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return Array.isArray(result.data) ? result.data : [];
    },

    getPumpReadingsByType: async (date: string, type: string): Promise<BenzenePumpReading[]> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/benzene/${date}/${type}`, {
            headers: getHeaders()
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return Array.isArray(result.data) ? result.data : [];
    },


    createPumpReading: async (data: { date: string, pumpNumber: number, pumpType: string, start: number, end: number }): Promise<BenzenePumpReading> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/benzene`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    getTotals: async (date: string): Promise<BenzeneTotals> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/benzene/totals/${date}`, {
            headers: getHeaders()
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    updatePumpReading: async (id: string, data: Partial<BenzenePumpReading>): Promise<BenzenePumpReading> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/benzene/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    deletePumpReading: async (id: string): Promise<boolean> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/benzene/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return true;
    }
};
