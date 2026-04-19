export type OilTab = 'sales' | 'inventory';

export interface Oil {
    _id?: string;
    id?: string;
    oilName: string;
    price: number;
    date?: string;
}

export interface OilStorage {
    _id?: string;
    id?: string;
    oilName: string;
    date: string;
    startBalance: number;
    storageIncoming: number;
    endBalance?: number; // Calculated by backend or derived
}

export interface OilShift {
    _id?: string;
    id?: string;
    oilName: string;
    date: string;
    firstTermBalance: number;
    endTermBalance: number;
    incoming: number;
    price?: number;
    sold?: number; // Calculated by backend
    total?: number; // Calculated by backend
}

export interface OilFormData {
    oilName: string;
    price?: number;
    date?: string;
    startBalance?: number;
    storageIncoming?: number;
    incoming?: number;
}
