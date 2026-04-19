export interface Expense {
    _id?: string;
    id?: string;
    date: string;
    receiptName: string;
    money: number;
}

export interface ExpenseFormData {
    receiptName: string;
    money: number;
    date: string;
}
