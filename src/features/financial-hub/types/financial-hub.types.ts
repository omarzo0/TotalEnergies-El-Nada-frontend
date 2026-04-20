export interface DailyFinancialSummary {
    date: string;
    globalBalance: number;
    openingBalance: number;

    closingBalance: number;

    fuel: {
        revenue: number;
        liters: number;
        count: number;
    };
    oil: {
        revenue: number;
        count: number;
    };
    treasury: {
        receipts: number;
        payments: number;
    };
    expenses: {
        total: number;
        count: number;
    };
    salaries: {
        monthlyLiability: number;
        count: number;
    };
    vouchers: {
        total: number;
        count: number;
    };
    clients: {
        total: number;
    };
    accounts: {
        netMovement: number;
    };
    island: {
        totalCash: number;
    };
    overview: {
        totalIn: number;
        totalOut: number;
        netProfit: number;
    };
}

export interface PeriodicFinancialReport {
    period: {
        start: string;
        end: string;
    };
    openingBalance: number;
    closingBalance: number;

    fuelRevenue: number;
    oilRevenue: number;
    receipts: number;
    payments: number;
    expenses: number;
    salaries?: number;
    vouchers?: number;
    clientPayments?: number;
    islandCash?: number;
    totalIn: number;
    totalOut: number;
    netProfit: number;
}
