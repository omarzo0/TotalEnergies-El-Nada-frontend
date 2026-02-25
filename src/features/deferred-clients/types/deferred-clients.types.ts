export interface DeferredClientRecord {
    id?: string;
    client: string;
    receipt: string;
    amount: string;
    image: string;
    date?: string;
}

export interface DeferredClientFormData {
    client: string;
    receipt: string;
    amount: string;
    image: string;
}
