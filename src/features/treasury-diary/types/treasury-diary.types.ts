export interface TreasuryRecord {
    id: string;
    amount: string;
    price: string;
    quantity: string;
    labelKey: string; // Translation key from treasuryItems or table.treasuryDiary
    isEditable?: boolean;
    isSummary?: boolean; // For total/net rows
}

export interface TreasuryDiaryFormData {
    amount: string;
    price: string;
    quantity: string;
    labelKey: string;
}
