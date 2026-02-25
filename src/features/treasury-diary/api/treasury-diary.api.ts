import { TreasuryRecord } from '../types/treasury-diary.types';

export const treasuryDiaryApi = {
    getRecords: async (): Promise<TreasuryRecord[]> => {
        // Mock data matching the original layout
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
            { id: "gas80", amount: "10000", price: "10", quantity: "1000", labelKey: "gasoline80" },
            { id: "gas92", amount: "15000", price: "12", quantity: "1250", labelKey: "gasoline92" },
            { id: "gas95", amount: "20000", price: "15", quantity: "1333", labelKey: "gasoline95" },
            { id: "oils", amount: "5000", price: "-", quantity: "-", labelKey: "oils" },
            { id: "total1", amount: "50000", price: "-", quantity: "-", labelKey: "total", isSummary: true },
            { id: "coupons", amount: "3000", price: "-", quantity: "-", labelKey: "coupons" },
            { id: "deferred", amount: "2000", price: "-", quantity: "-", labelKey: "deferredClients" },
            { id: "expenses", amount: "1500", price: "-", quantity: "-", labelKey: "expenses" },
            { id: "total2", amount: "43500", price: "-", quantity: "-", labelKey: "total", isSummary: true },
            { id: "net", amount: "6500", price: "-", quantity: "-", labelKey: "net", isSummary: true },
            { id: "island", amount: "5000", price: "-", quantity: "-", labelKey: "island", isEditable: true },
            { id: "shift", amount: "1500", price: "-", quantity: "-", labelKey: "fromShift", isEditable: true },
            { id: "netCash", amount: "6500", price: "-", quantity: "-", labelKey: "netCash", isSummary: true },
        ];
    },

    createRecord: async (data: Partial<TreasuryRecord>): Promise<TreasuryRecord> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            id: Math.random().toString(36).substr(2, 9),
            amount: data.amount || '0',
            price: data.price || '0',
            quantity: data.quantity || '0',
            labelKey: data.labelKey || 'extraInfo',
            isEditable: true,
        };
    },

    updateRecord: async (id: string, data: Partial<TreasuryRecord>): Promise<TreasuryRecord> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            id,
            amount: '0',
            price: '0',
            quantity: '0',
            labelKey: 'extraInfo',
            ...data
        };
    },

    deleteRecord: async (id: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    }
};
