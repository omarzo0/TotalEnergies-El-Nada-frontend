export interface ShiftRecord {
    pump: string;
    type: string;
    start: string;
    end: string;
    total: string;
    priceDiff: string;
    transfer: string;
    description: string;
    creditor: string;
    debtor: string;
}

export interface ShiftFormData {
    pump: string;
    type: string;
    start: string;
    end: string;
    priceDiff: string;
    transfer: string;
    description: string;
    creditor: string;
    debtor: string;
}
