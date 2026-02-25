import { TrialBalanceEntry, IncomeStatementEntry } from '../types/financial-system.types';

export const financialSystemApi = {
    getTrialBalance: async (): Promise<TrialBalanceEntry[]> => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return [
            { id: "1", code: "1101", name: "Cash in Treasury", debit: 150000, credit: 0, balance: 150000, type: 'asset' },
            { id: "2", code: "1102", name: "Bank Account", debit: 500000, credit: 0, balance: 500000, type: 'asset' },
            { id: "3", code: "1201", name: "Accounts Receivable", debit: 75000, credit: 0, balance: 75000, type: 'asset' },
            { id: "4", code: "2101", name: "Accounts Payable", debit: 0, credit: 120000, balance: -120000, type: 'liability' },
            { id: "5", code: "3101", name: "Capital", debit: 0, credit: 500000, balance: -500000, type: 'equity' },
            { id: "6", code: "4101", name: "Sales Revenue", debit: 0, credit: 200000, balance: -200000, type: 'revenue' },
            { id: "7", code: "5101", name: "Fuel Expenses", debit: 85000, credit: 0, balance: 85000, type: 'expense' },
            { id: "8", code: "5201", name: "Salaries", debit: 10000, credit: 0, balance: 10000, type: 'expense' },
        ];
    },

    getIncomeStatement: async (): Promise<IncomeStatementEntry[]> => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return [
            {
                category: "Revenues",
                items: [{ name: "Sales Revenue", amount: 200000 }],
                total: 200000
            },
            {
                category: "Expenses",
                items: [
                    { name: "Fuel Expenses", amount: 85000 },
                    { name: "Salaries", amount: 10000 },
                    { name: "Utilities", amount: 5000 }
                ],
                total: 100000
            }
        ];
    }
};
