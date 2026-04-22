import { TreasurySummary, TreasuryManualEntry, TreasuryUpdateData } from '../types/daily-treasury.types';

import { getHeaders } from "@/utils/api.utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const dailyTreasuryApi = {
    // 1. Get Daily Treasury Summary
    getSummary: async (date: string): Promise<TreasurySummary> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/daily-treasury/${date}`, {
            headers: getHeaders()
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to fetch summary");

        // Extract the first item from the data array
        if (Array.isArray(result.data) && result.data.length > 0) {
            return result.data[0];
        }

        return result.data;
    },

    // 2. Update Island Entry
    updateIsland: async (data: TreasuryUpdateData): Promise<void> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/daily-treasury/island`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to update island entry");
    },

    // 3. Update From Shift Entry
    updateFromShift: async (data: TreasuryUpdateData): Promise<void> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/daily-treasury/from-shift`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to update shift entry");
    },

    // 4. Create New Manual Entry
    createEntry: async (data: Omit<TreasuryManualEntry, 'id'>): Promise<void> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/daily-treasury`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to create entry");
    },

    // 5. Delete Entry
    deleteEntry: async (id: string): Promise<void> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/daily-treasury/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to delete entry");
    }
};
