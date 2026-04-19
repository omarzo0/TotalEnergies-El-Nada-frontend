export interface Employee {
    id?: string;
    _id?: string;
    name: string;
    nationalId: number;
    mobileNum: number;
    job: string;
    salary: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface EmployeeFormData {
    name: string;
    nationalId: number;
    mobileNum: number;
    job: string;
    salary: number;
}

export interface EmployeeSearchFilters {
    name?: string;
}
