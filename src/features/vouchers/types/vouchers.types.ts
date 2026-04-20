export type FuelType = 'solar' | 'ben80' | 'ben92' | 'ben95';


export interface VoucherRecord {
    id?: string;
    date: string;
    side: string;
    voucherSerial: string;
    total: number;
    liters: number;
    price: number;
    pumpType: FuelType;
}

export interface VoucherFormData {
    date: string;
    side: string;
    voucherSerial: string;
    total?: number;
    liters: number;
    price?: number;
    pumpType: FuelType;
}

export interface VoucherMatchingRecord {
    date: string;
    number: number;
    liters: number;
    pumpType: FuelType;
    side: string;
    price: number;
    total: number;
}



