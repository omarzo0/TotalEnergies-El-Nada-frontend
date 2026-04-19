export interface StatementEntry {
    sand: string;       // mapped from backend "receiptName"
    money: number;
}

export interface StatementSummary {
    statement: string;
    entries: StatementEntry[];
    total: number;
    na2l: number;       // mapped from backend "transfer"
    fr2s3r: number;     // mapped from backend "priceDiff"
}

export interface BenzeneReading {
    trumbaNumber: number;   // mapped from backend "pumpNumber"
    trumbaType: string;     // mapped from backend "pumpType"
    start: number;
    end: number;
    total: number;
}

export interface ShiftDiarySummary {
    number: string;
    date: string;
    mkbodat: StatementSummary[];    // mapped from backend "receipts"
    mdfo3at: StatementSummary[];    // mapped from backend "payments"
    benzene: BenzeneReading[];
}

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
