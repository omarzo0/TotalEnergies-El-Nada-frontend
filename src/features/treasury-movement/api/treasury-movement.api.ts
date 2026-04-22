import { TreasuryMovement, TreasuryMovementFormData, TreasuryMovementSearchFilters } from '../types/treasury-movement.types';

import { getHeaders } from "@/utils/api.utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const treasuryMovementApi = {
    // 1. GET /api/treasury-movement/:date?type=...&statement=...
    getMovements: async (filters: TreasuryMovementSearchFilters): Promise<TreasuryMovement[]> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const { date, type, statement } = filters;
        let url = `${API_URL}/treasury-movement/${date}`;

        const params = new URLSearchParams();
        if (type && type !== 'all') params.append('type', type);
        if (statement) params.append('statement', statement);

        const queryString = params.toString();
        if (queryString) url += `?${queryString}`;

        const response = await fetch(url, {
            headers: getHeaders()
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            const msg = (result.message || "").toLowerCase();
            const isNoData = response.status === 404 || msg.includes("data") || msg.includes("بيانات");
            if (isNoData) return [];
            throw new Error(result.message || "Failed to fetch treasury movements");
        }

        // Correctly handle the nested structure: result.data[0].data
        if (Array.isArray(result.data) && result.data[0]?.data && Array.isArray(result.data[0].data)) {
            return result.data[0].data;
        }

        return Array.isArray(result.data) ? result.data : [];
    },

    // 2. POST /api/treasury-movement
    createMovement: async (data: TreasuryMovementFormData): Promise<TreasuryMovement> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/treasury-movement`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to create movement");
        return result.data;
    },

    // 3. PUT /api/treasury-movement/:id
    updateMovement: async (id: string, data: TreasuryMovementFormData): Promise<TreasuryMovement> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/treasury-movement/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to update movement");
        return result.data;
    },

    // 4. DELETE /api/treasury-movement/:id
    deleteMovement: async (id: string): Promise<boolean> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/treasury-movement/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        const result = await response.json();
        return result.success;
    }
};
