export type TreasuryMovementType = 'مقبوضات' | 'مدفوعات' | 'all';

export interface TreasuryMovement {
    id: string;
    _id?: string;
    date: string;
    type: 'مقبوضات' | 'مدفوعات';
    statement: string;
    receiptName: string; // was sand
    money: number;
    description: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface TreasuryMovementFormData {
    date: string;
    type: 'مقبوضات' | 'مدفوعات';
    statement: string;
    receiptName: string;
    money: number;
    description: string;
}

export interface TreasuryMovementSearchFilters {
    date: string;
    type?: string;
    statement?: string;
}

export interface Account {
    id?: string;
    _id?: string;
    date: string;
    name: string;
    receiptName: string;
    money: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface AccountFormData {
    date: string;
    name: string;
    receiptName: string;
    money: number;
}

export interface AccountSearchFilters {
    date: string;
    name?: string;
}
