import { VoucherRecord, VoucherMatchingRecord, FuelType, VoucherEntity } from '../types/vouchers.types';

export const vouchersApi = {
    getVouchers: async (): Promise<VoucherRecord[]> => {
        // Mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
            { id: "1", entity: "police", serial: "001", total: "500", category: "50", price: "10", fuelType: "gasoline92", image: "/images/logo.png" },
            { id: "2", entity: "association", serial: "002", total: "1000", category: "100", price: "10", fuelType: "diesel", image: "/images/logo.png" },
            { id: "3", entity: "police", serial: "003", total: "750", category: "50", price: "15", fuelType: "gasoline95", image: "/images/logo.png" },
        ];
    },

    getMatchingRecords: async (filters?: { fuelType?: FuelType, entity?: VoucherEntity }): Promise<VoucherMatchingRecord[]> => {
        // Mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
            { total: "500", category: "50", count: "10" },
            { total: "1000", category: "100", count: "10" },
            { total: "750", category: "50", count: "15" },
        ];
    },

    createVoucher: async (data: Partial<VoucherRecord>): Promise<VoucherRecord> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            id: Math.random().toString(36).substr(2, 9),
            entity: data.entity || 'police',
            serial: data.serial || '',
            total: data.total || '0',
            category: data.category || '',
            price: data.price || '0',
            fuelType: data.fuelType || 'gasoline92',
            image: data.image || '/images/logo.png',
        };
    },

    updateVoucher: async (id: string, data: Partial<VoucherRecord>): Promise<VoucherRecord> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            id,
            entity: data.entity || 'police',
            serial: data.serial || '',
            total: data.total || '0',
            category: data.category || '',
            price: data.price || '0',
            fuelType: data.fuelType || 'gasoline92',
            image: data.image || '/images/logo.png',
        };
    },

    deleteVoucher: async (id: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    }
};
