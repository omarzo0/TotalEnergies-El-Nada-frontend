export interface TreasuryTransaction {
    id: string;
    amount: string;
    receipt: string;
    description: string; // This corresponds to statementTypes in translations
    date: string;
}

export interface TreasuryAccount {
    id: string;
    receipt: string;
    amount: string;
}

export interface TreasuryTransactionFormData {
    amount: string;
    receipt: string;
    description: string;
}

export interface TreasuryAccountFormData {
    amount: string;
    receipt: string;
    accountant: string;
}
