import { SystemLogEntry } from '../types/system-log.types';

export const systemLogApi = {
    getLogs: async (): Promise<SystemLogEntry[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
            { id: "1", modifiedTo: "بنزين 92: 50000", modifiedFrom: "بنزين 92: 45000", username: "admin", type: "تعديل", time: "10:30", date: "24/02" },
            { id: "2", modifiedTo: "سولار: 80000", modifiedFrom: "سولار: 75000", username: "admin", type: "تعديل", time: "11:00", date: "24/02" },
            { id: "3", modifiedTo: "-", modifiedFrom: "زيت موتور", username: "admin", type: "حذف", time: "14:00", date: "24/02" },
        ];
    }
};
