import { getHeaders } from "@/utils/api.utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface StationData {
    id: string;
    name: string;
    nameAr: string;
    code: string;
    address: string;
    phone: string;
    logo?: string;
}

export const stationApi = {
    getStation: async (): Promise<StationData> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/station`, {
            headers: getHeaders()
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to fetch station details");

        // Handle array wrapper
        const station = Array.isArray(result.data) ? result.data[0] : result.data;
        return station;
    },

    updateStation: async (data: Partial<StationData>): Promise<StationData> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/station`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to update station details");

        // Handle array wrapper
        const station = Array.isArray(result.data) ? result.data[0] : result.data;
        return station as StationData;
    }
};
