export interface ExpenseRecord {
    id?: string;
    amount: string;
    receipt: string;
    date?: string;
}

export interface ExpenseFormData {
    amount: string;
    receipt: string;
}
