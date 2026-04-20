export interface StatementEntry {
    receiptName: string;
    money: number;
}


export interface StatementSummary {
    statement: string;
    entries: StatementEntry[];
    total: number;
    transfer: number;
    priceDiff: number;
    originalType?: string; // "مقبوضات" or "مدفوعات"
}


export interface BenzeneReading {
    trumbaNumber: number;   // mapped from backend "pumpNumber"
    trumbaType: string;     // mapped from backend "pumpType"
    start: number;
    end: number;
    total: number;
}
export interface ExpenseReading {
    receiptName: string;
    money: number;
}

export interface SupplyBookEntry {
    benzType: string;
    start: number;
    incoming: number;
    dispensed: number;
    pumps: string;
    end: number;
    standard: number;
}

export interface ShiftDiarySummary {
    number: string;
    date: string;
    mkbodat: StatementSummary[];    // mapped from backend "receipts"
    mdfo3at: StatementSummary[];    // mapped from backend "payments"
    accounts: StatementSummary[];   // extracted from receipts/payments
    benzene: BenzeneReading[];
    expenses: ExpenseReading[];
    supplyBook: SupplyBookEntry[];
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
