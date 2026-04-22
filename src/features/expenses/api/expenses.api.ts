import { Expense } from '../types/expenses.types';

import { getHeaders } from "@/utils/api.utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const expensesApi = {
    getExpensesByDate: async (date: string): Promise<Expense[]> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/expenses/${date}`, {
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

    addExpense: async (data: { date: string; receiptName: string; money: number }): Promise<Expense> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/expenses`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    updateExpense: async (id: string, data: { receiptName?: string; money?: number }): Promise<Expense> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/expenses/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    },

    deleteExpense: async (id: string): Promise<boolean> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/expenses/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        const result = await response.json();
        return result.success;
    }
};
