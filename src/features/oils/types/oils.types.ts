export type OilRecordType = 'shift' | 'storage';

export interface OilRecord {
    oilType: string;
    startBalance: string;
    endBalance: string;
    incoming: string;
    sold?: string;
    image: string;
}

export interface OilFormData {
    oilType: string;
    incoming: string;
    startBalance: string;
    endBalance: string;
    image: string;
}
