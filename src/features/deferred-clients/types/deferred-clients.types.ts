export interface DeferredClientPayment {
    _id?: string;
    id?: string;
    date: string;
    clientName: string;
    receiptName: string;
    money: number;
    amount: number;
    receiptNumber: string;
}

export interface DeferredClientFormData {
    clientName: string;
    receiptName: string;
    money: number;
    amount: number;
    receiptNumber: string;
    date: string;
}

export interface TermClientResponse {
    data: DeferredClientPayment[];
    total: number;
}
