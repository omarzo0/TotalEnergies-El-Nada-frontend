export type VoucherEntity = 'police' | 'association';
export type FuelType = 'diesel' | 'gasoline95' | 'gasoline92' | 'gasoline80';

export interface VoucherRecord {
    id?: string;
    entity: VoucherEntity;
    serial: string;
    total: string;
    category: string;
    price: string;
    fuelType: FuelType;
    image: string;
}

export interface VoucherFormData {
    entity: VoucherEntity;
    serial: string;
    total: string;
    category: string;
    price: string;
    fuelType: FuelType;
    image: string;
}

export interface VoucherMatchingRecord {
    total: string;
    category: string;
    count: string;
    fuelType?: FuelType;
    entity?: VoucherEntity;
}
