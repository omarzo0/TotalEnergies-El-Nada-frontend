import { ExpenseRecord } from '../types/expenses.types';

export const expensesApi = {
    getExpenses: async (): Promise<ExpenseRecord[]> => {
        const response = await fetch('/expenses/api');
        if (!response.ok) throw new Error('Failed to fetch expenses');
        return response.json();
    },

    createExpense: async (data: ExpenseRecord): Promise<ExpenseRecord> => {
        const response = await fetch('/expenses/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create expense');
        const res = await response.json();
        return res.data;
    },

    updateExpense: async (id: string, data: Partial<ExpenseRecord>): Promise<ExpenseRecord> => {
        // Mock update for now
        await new Promise(resolve => setTimeout(resolve, 500));
        return { id, amount: "0", receipt: "", ...data };
    },

    deleteExpense: async (id: string): Promise<boolean> => {
        // Mock delete for now
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    }
};
