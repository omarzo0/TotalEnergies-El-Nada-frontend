import { OilRecord, OilRecordType } from '../types/oils.types';

export const oilsApi = {
    getRecords: async (type: OilRecordType): Promise<OilRecord[]> => {
        // In a real app, this would be a real API call
        // For now, we mock based on the type
        await new Promise(resolve => setTimeout(resolve, 500));

        if (type === 'shift') {
            return [
                { oilType: "زيت موتور", startBalance: "100", endBalance: "80", incoming: "0", sold: "20", image: "/images/logo.png" },
                { oilType: "زيت فرامل", startBalance: "50", endBalance: "45", incoming: "0", sold: "5", image: "/images/logo.png" },
                { oilType: "زيت جير", startBalance: "30", endBalance: "28", incoming: "0", sold: "2", image: "/images/logo.png" },
            ];
        } else {
            return [
                { oilType: "زيت موتور", startBalance: "200", endBalance: "180", incoming: "0", image: "/images/logo.png" },
                { oilType: "زيت فرامل", startBalance: "100", endBalance: "95", incoming: "0", image: "/images/logo.png" },
                { oilType: "زيت جير", startBalance: "60", endBalance: "55", incoming: "0", image: "/images/logo.png" },
            ];
        }
    },

    createRecord: async (type: OilRecordType, data: Partial<OilRecord>): Promise<OilRecord> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            oilType: data.oilType || "",
            startBalance: data.startBalance || "0",
            endBalance: data.endBalance || "0",
            incoming: data.incoming || "0",
            sold: type === 'shift' ? (parseFloat(data.startBalance || "0") + parseFloat(data.incoming || "0") - parseFloat(data.endBalance || "0")).toString() : undefined,
            image: data.image || "/images/logo.png"
        };
    },

    updateRecord: async (type: OilRecordType, oilType: string, data: Partial<OilRecord>): Promise<OilRecord> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            oilType,
            startBalance: "0",
            endBalance: "0",
            incoming: "0",
            image: "/images/logo.png",
            ...data
        };
    },

    deleteRecord: async (type: OilRecordType, oilType: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    }
};
