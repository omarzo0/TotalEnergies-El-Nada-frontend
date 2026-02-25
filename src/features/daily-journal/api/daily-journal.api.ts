import { DailyJournalRecord, DailyJournalFormData } from '../types/daily-journal.types';

export const dailyJournalApi = {
    getRecords: async (): Promise<DailyJournalRecord[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
            { id: "1", priceDiff: "0", transfer: "500", description: "عمر\n3 | 4", creditor: "1000", debtor: "500", date: "2023-12-24" },
            { id: "2", priceDiff: "0", transfer: "300", description: "عمر\n3 | 4", creditor: "800", debtor: "300", date: "2023-12-24" },
            { id: "3", priceDiff: "0", transfer: "200", description: "عمر\n3 | 4", creditor: "600", debtor: "200", date: "2023-12-24" },
        ];
    },

    createRecord: async (data: DailyJournalFormData): Promise<DailyJournalRecord> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            date: data.date || new Date().toISOString().split('T')[0],
        };
    },

    updateRecord: async (id: string, data: Partial<DailyJournalRecord>): Promise<DailyJournalRecord> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            id,
            priceDiff: "0",
            transfer: "0",
            description: "",
            creditor: "0",
            debtor: "0",
            date: "",
            ...data
        };
    },

    deleteRecord: async (id: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    }
};
