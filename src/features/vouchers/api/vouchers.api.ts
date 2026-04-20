import { VoucherRecord, VoucherMatchingRecord, FuelType } from '../types/vouchers.types';


const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = () => {
    let token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

    if (token) {
        token = token.trim().replace(/^"(.*)"$/, '$1');
    }

    if (!token || token === "null" || token === "undefined" || token === "[object Object]") {
        console.warn("FrontEnd API: Token is missing or invalid!");
        return { "Content-Type": "application/json" };
    }

    const finalToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    return {
        "Content-Type": "application/json",
        "Authorization": finalToken
    };
};

export const vouchersApi = {
    getVouchers: async (date: string, pumpType?: FuelType): Promise<VoucherRecord[]> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        let url = `${API_URL}/vouchers/${date}`;
        if (pumpType) {
            url += `?pumpType=${encodeURIComponent(pumpType)}`;
        }


        const response = await fetch(url, {
            headers: getHeaders()
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return Array.isArray(result.data) ? result.data : [];
    },

    getMatchingRecords: async (date: string, filters?: { pumpType?: FuelType, side?: string }): Promise<VoucherMatchingRecord[]> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const headers = getHeaders();

        let url = `${API_URL}/matching-vouchers/${date}`;
        const queryParts: string[] = [];
        if (filters?.pumpType) queryParts.push(`pumpType=${encodeURIComponent(filters.pumpType)}`);
        if (filters?.side) queryParts.push(`side=${encodeURIComponent(filters.side)}`);


        if (queryParts.length > 0) {
            url += `?${queryParts.join('&')}`;
        }

        const response = await fetch(url, { headers });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);

        // Handle array-wrapped nested data: { data: [ { data: [...], total: ... } ] }
        const dataObj = Array.isArray(result.data) ? result.data[0] : result.data;

        if (dataObj?.data && Array.isArray(dataObj.data)) {
            return dataObj.data;
        }
        return Array.isArray(result.data) ? result.data : [];
    },

    getMatchingTotal: async (date: string, filters?: { pumpType?: FuelType, side?: string }): Promise<number> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const headers = getHeaders();

        let url = `${API_URL}/matching-vouchers/${date}`;
        const queryParts: string[] = [];
        if (filters?.pumpType) queryParts.push(`pumpType=${encodeURIComponent(filters.pumpType)}`);
        if (filters?.side) queryParts.push(`side=${encodeURIComponent(filters.side)}`);


        if (queryParts.length > 0) {
            url += `?${queryParts.join('&')}`;
        }

        const response = await fetch(url, { headers });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);

        // Handle array-wrapped nested total: { data: [ { total: ... } ] }
        const dataObj = Array.isArray(result.data) ? result.data[0] : result.data;

        if (dataObj?.total !== undefined) return dataObj.total;
        return typeof result.data === 'number' ? result.data : 0;
    },

    createVoucher: async (data: Partial<VoucherRecord>): Promise<VoucherRecord> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/vouchers`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    updateVoucher: async (id: string, data: Partial<VoucherRecord>): Promise<VoucherRecord> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/vouchers/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    deleteVoucher: async (id: string): Promise<boolean> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/vouchers/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return true;
    }
};

