export interface FuelInfo {
    quantity: number;
    price: number;
    money: number;
}

export interface FuelSales {
    solar: FuelInfo;
    ben80: FuelInfo;
    ben92: FuelInfo;
    ben95: FuelInfo;
}

export interface DeductionInfo {
    count: number;
    total: number;
}

export interface TreasurySummary {
    fuel: FuelSales;
    oils: {
        quantity: number;
        money: number;
    };
    totalIncome: number;
    deductions: {
        vouchers: DeductionInfo;
        expenses: DeductionInfo;
        termClients: DeductionInfo;
    };
    totalDeductions: number;
    safe: number;
    island: {
        quantity: number;
        price: number;
        money: number;
    };
    fromShift: {
        quantity: number;
        price: number;
        money: number;
    };
    manualEntries?: TreasuryManualEntry[];
    lastSafe?: number;
}

export interface TreasuryManualEntry {
    id: string;
    _id?: string;
    date: string;
    quantity: number;
    price: number;
    money: number;
    statement: string;
}

export interface TreasuryUpdateData {
    date: string;
    quantity: number;
    price: number;
}
