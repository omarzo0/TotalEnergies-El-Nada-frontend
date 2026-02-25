import { ShiftRecord } from '../types/shift-diary.types';

export const shiftDiaryApi = {
    getShifts: async (): Promise<ShiftRecord[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
            { pump: "1", type: "بنزين 92", start: "50000", end: "51000", total: "1000" },
            { pump: "2", type: "بنزين 80", start: "30000", end: "32000", total: "2000" },
            { pump: "3", type: "سولار", start: "80000", end: "85000", total: "5000" },
        ];
    },

    createShift: async (data: Partial<ShiftRecord>): Promise<ShiftRecord> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            pump: data.pump || "0",
            type: data.type || "",
            start: data.start || "0",
            end: data.end || "0",
            total: (Number(data.end || 0) - Number(data.start || 0)).toString(),
        };
    },

    updateShift: async (pumpId: string, data: Partial<ShiftRecord>): Promise<ShiftRecord> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            pump: pumpId,
            type: data.type || "",
            start: data.start || "0",
            end: data.end || "0",
            total: (Number(data.end || 0) - Number(data.start || 0)).toString(),
            ...data
        };
    },

    deleteShift: async (pumpId: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return true;
    }
};
