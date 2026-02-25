export interface SupplyBookRecord {
    id: string;
    standard: string;
    end: string;
    pumps: string;
    dispensed: string;
    incoming: string;
    start: string;
    date: string;
    fuelType: string;
}

export interface BalanceMatchingRecord {
    id: string;
    gasoline95: string;
    gasoline92: string;
    gasoline80: string;
    diesel: string;
    descriptionKey: string; // Translation key from balanceItems
}

export interface GaugeRecord {
    id: string;
    gasoline95: string;
    gasoline92: string;
    gasoline80: string;
    diesel: string;
    descriptionKey: string;
}

export interface SupplyBookFormData {
    standard: string;
    end: string;
    start: string;
    pumps: string;
    dispensed: string;
    incoming: string;
    fuelType: string;
    date: string;
}
