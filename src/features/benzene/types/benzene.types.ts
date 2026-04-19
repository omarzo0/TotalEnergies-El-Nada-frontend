export interface BenzeneRecord {
    id: string;
    type: string; // trumbaType
    trumbaNumber: number;
    startBalance: number;
    endBalance: number;
    incoming: number;
    sold: number; // total liters
    price: number;
    total: number; // monetary value (sold in backend)
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
    trumbaNumber?: number;
    pumpNumber?: number; // Backend alias
    trumbaType?: string;
    pumpType?: string; // Backend alias
    start: number;
    end: number;
    total: number; // liters
    incoming: number;
    price: number;
    sold: number; // monetary value
}

export interface BenzeneTotals {
    solar: number;
    ben80: number;
    ben92: number;
    ben95: number;
}

export type BenzeneTab = 'readings' | 'prices';
