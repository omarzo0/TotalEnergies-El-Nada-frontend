export interface DailyJournalRecord {
    id: string;
    priceDiff: string;
    transfer: string;
    description: string;
    creditor: string;
    debtor: string;
    date: string;
}

export interface DailyJournalFormData {
    priceDiff: string;
    transfer: string;
    description: string;
    creditor: string;
    debtor: string;
    date?: string;
}
