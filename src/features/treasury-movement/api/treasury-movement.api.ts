import { TreasuryTransaction, TreasuryAccount } from '../types/treasury-movement.types';

export const treasuryMovementApi = {
    // Transactions
    getTransactions: async (): Promise<TreasuryTransaction[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
            { id: "1", amount: "5000", receipt: "سند #200", description: "ح/العملاء", date: "2023-12-24" },
            { id: "2", amount: "3000", receipt: "سند #201", description: "ح/العملاء", date: "2023-12-24" },
            { id: "3", amount: "7000", receipt: "سند #202", description: "ح/العملاء", date: "2023-12-24" },
        ];
    },

    createTransaction: async (data: Partial<TreasuryTransaction>): Promise<TreasuryTransaction> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            id: Math.random().toString(36).substr(2, 9),
            amount: data.amount || "0",
            receipt: data.receipt || "",
            description: data.description || "",
            date: new Date().toISOString().split('T')[0],
        };
    },

    updateTransaction: async (id: string, data: Partial<TreasuryTransaction>): Promise<TreasuryTransaction> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            id,
            amount: "0",
            receipt: "",
            description: "",
            date: "",
            ...data
        };
    },

    deleteTransaction: async (id: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    },

    // Accounts
    getAccounts: async (): Promise<TreasuryAccount[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
            { id: "1", receipt: "سند #300", amount: "10000" },
            { id: "2", receipt: "سند #301", amount: "15000" },
            { id: "3", receipt: "سند #302", amount: "8000" },
        ];
    },

    createAccount: async (data: Partial<TreasuryAccount>): Promise<TreasuryAccount> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            id: Math.random().toString(36).substr(2, 9),
            receipt: data.receipt || "",
            amount: data.amount || "0",
        };
    },

    updateAccount: async (id: string, data: Partial<TreasuryAccount>): Promise<TreasuryAccount> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            id,
            receipt: "",
            amount: "0",
            ...data
        };
    },

    deleteAccount: async (id: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    }
};
