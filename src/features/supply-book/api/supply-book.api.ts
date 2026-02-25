import { SupplyBookRecord, BalanceMatchingRecord, GaugeRecord } from '../types/supply-book.types';

export const supplyBookApi = {
    getRecords: async (): Promise<SupplyBookRecord[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
            { id: "1", standard: "0", end: "9500", start: "10000", pumps: "9500", dispensed: "500", incoming: "0", date: "22/12", fuelType: "diesel" },
            { id: "2", standard: "0", end: "4800", start: "5000", pumps: "4800", dispensed: "200", incoming: "0", date: "22/12", fuelType: "diesel" },
            { id: "3", standard: "0", end: "7000", start: "8000", pumps: "7000", dispensed: "1000", incoming: "0", date: "22/12", fuelType: "diesel" },
        ];
    },

    createRecord: async (data: Partial<SupplyBookRecord>): Promise<SupplyBookRecord> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            id: Math.random().toString(36).substr(2, 9),
            standard: data.standard || "0",
            end: data.end || "0",
            start: data.start || "0",
            pumps: data.pumps || "0",
            dispensed: data.dispensed || "0",
            incoming: data.incoming || "0",
            date: data.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }),
            fuelType: data.fuelType || "diesel",
        };
    },

    updateRecord: async (id: string, data: Partial<SupplyBookRecord>): Promise<SupplyBookRecord> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            id,
            standard: "0",
            end: "0",
            start: "0",
            pumps: "0",
            dispensed: "0",
            incoming: "0",
            date: "",
            fuelType: "diesel",
            ...data
        };
    },

    deleteRecord: async (id: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    },

    getBalanceMatching: async (): Promise<BalanceMatchingRecord[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
            { id: "1", gasoline95: "1000", gasoline92: "2000", gasoline80: "3000", diesel: "5000", descriptionKey: "startBalance" },
            { id: "2", gasoline95: "0", gasoline92: "0", gasoline80: "0", diesel: "0", descriptionKey: "incoming" },
            { id: "3", gasoline95: "1000", gasoline92: "2000", gasoline80: "3000", diesel: "5000", descriptionKey: "total" },
            { id: "4", gasoline95: "500", gasoline92: "1000", gasoline80: "1500", diesel: "2500", descriptionKey: "dispensed" },
            { id: "5", gasoline95: "500", gasoline92: "1000", gasoline80: "1500", diesel: "2500", descriptionKey: "remaining" },
        ];
    },

    getGauges: async (): Promise<GaugeRecord[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
            { id: "gauge1", gasoline95: "0", gasoline92: "0", gasoline80: "0", diesel: "0", descriptionKey: "standard" },
        ];
    },

    updateGauge: async (id: string, data: Partial<GaugeRecord>): Promise<GaugeRecord> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            id,
            gasoline95: "0",
            gasoline92: "0",
            gasoline80: "0",
            diesel: "0",
            descriptionKey: "standard",
            ...data
        };
    }
};
