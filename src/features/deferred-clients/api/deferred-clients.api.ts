import { DeferredClientRecord } from '../types/deferred-clients.types';

export const deferredClientsApi = {
    getClients: async (): Promise<DeferredClientRecord[]> => {
        // Mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
            { id: "1", client: "عميل 1", receipt: "سند #100", amount: "5000", image: "/images/logo.png" },
            { id: "2", client: "عميل 2", receipt: "سند #101", amount: "3000", image: "/images/logo.png" },
            { id: "3", client: "عميل 3", receipt: "سند #102", amount: "7500", image: "/images/logo.png" },
        ];
    },

    createClient: async (data: Partial<DeferredClientRecord>): Promise<DeferredClientRecord> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            id: Math.random().toString(36).substr(2, 9),
            client: data.client || '',
            receipt: data.receipt || '',
            amount: data.amount || '0',
            image: data.image || '/images/logo.png',
        };
    },

    updateClient: async (id: string, data: Partial<DeferredClientRecord>): Promise<DeferredClientRecord> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            id,
            client: '',
            receipt: '',
            amount: '0',
            image: '/images/logo.png',
            ...data
        };
    },

    deleteClient: async (id: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    }
};
