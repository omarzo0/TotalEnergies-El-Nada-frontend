export type VoucherEntity = 'police' | 'association';
export type FuelType = 'سولار' | 'بنزين 80' | 'بنزين 92' | 'بنزين 95';

export interface VoucherRecord {
    id?: string;
    date: string;
    side: VoucherEntity;
    voucherSerial: string;
    total: number;
    category: number;
    price: number;
    benzType: FuelType;
}

export interface VoucherFormData {
    date: string;
    side: VoucherEntity;
    voucherSerial: string;
    total?: number;
    category: number;
    price?: number;
    benzType: FuelType;
}

export interface VoucherMatchingRecord {
    date: string;
    number: number;
    category: number;
    benzType: FuelType;
    side: VoucherEntity;
    price: number;
    total: number;
}


