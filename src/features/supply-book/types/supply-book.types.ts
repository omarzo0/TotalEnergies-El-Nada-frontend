export interface SupplyBookRecord {
    _id?: string;
    id?: string;
    date: string;
    benzType: string;
    start: number;
    incoming: number;
    dispensed: number;
    pumps: string;
    end: number;
    standard: number;
}

export interface SupplyBookFormData {
    date: string;
    benzType: string;
    start: number;
    incoming: number;
    pumps: string;
    standard: number;
}

export interface MonthlyBalance {
    start: number;
    incoming: number;
    total: number;
    dispensed: number;
    balance: number;
}

export interface MonthlyBalanceResponse {
    [fuelType: string]: MonthlyBalance;
}

export interface StandardGaugesResponse {
    [fuelType: string]: number;
}

export interface StandardUpdatePayload {
    date: string;
    standardSolar: number;
    standardB80: number;
    standardB92: number;
    standardB95: number;
}

// Fuel type constants matching backend Arabic values
export const FUEL_TYPES = {
    SOLAR: "سولار",
    B80: "بنزين 80",
    B92: "بنزين 92",
    B95: "بنزين 95"
} as const;

export type FuelType = typeof FUEL_TYPES[keyof typeof FUEL_TYPES];
