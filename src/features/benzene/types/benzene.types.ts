export interface BenzeneRecord {
    id: string;
    pumpType: string;
    pumpNumber: number;
    startBalance: number;
    endBalance: number;
    liters: number; // total liters
    price: number;
    totalAmount: number; // monetary value
    date: string;
}

export type BenzeneRecordType = 'shift' | 'storage';

// --- Prices API types ---
export interface BenzenePrices {
    solarPrice: number;
    ben80Price: number;
    ben92Price: number;
    ben95Price: number;
}

export interface BenzenePricesResponse {
    date: string;
    prices: BenzenePrices;
}

// --- Pump Reading API types (Backend Response) ---
export interface BenzenePumpReading {
    _id?: string;
    date: string;
    pumpNumber: number;
    pumpType: string;
    start: number;
    end: number;
    liters: number; // liters
    price: number;
    totalAmount: number; // monetary value
    trumbaNumber?: number; // Legacy fallback
    trumbaType?: string; // Legacy fallback
}

export interface BenzeneTotals {
    solar: number;
    ben80: number;
    ben92: number;
    ben95: number;
}

export type BenzeneTab = 'readings' | 'prices';
