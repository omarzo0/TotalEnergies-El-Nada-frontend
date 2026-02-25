export interface FinancialAccount {
    id: string;
    code: string;
    name: string;
    debit: number;
    credit: number;
    balance: number;
    type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
}

export interface TrialBalanceEntry extends FinancialAccount { }

export interface IncomeStatementEntry {
    category: string;
    items: {
        name: string;
        amount: number;
    }[];
    total: number;
}

export interface FinancialReportData {
    period: string;
    generatedAt: string;
    entries: TrialBalanceEntry[];
}
