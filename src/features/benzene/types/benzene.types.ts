export interface BenzeneRecord {
    id: string;
    type: string; // e.g., 'Benzene 95', 'Benzene 92'
    startBalance: number;
    endBalance: number;
    incoming: number;
    sold: number;
    price: number;
    total: number;
    date: string;
}

export type BenzeneRecordType = 'shift' | 'storage';
