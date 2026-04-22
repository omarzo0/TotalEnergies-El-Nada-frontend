import { StationRole, StationModule, StationAction, StationPermissions } from '@/features/auth/permissions';

export type Role = StationRole;
export type Resource = StationModule;
export type Action = StationAction;
export type Permissions = StationPermissions;

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    language: string;
    userType: string;
    station: string;
    isSuperAdmin: boolean;
}

export interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
}

export interface NavItem {
    key: string;
    href: string;
    icon: string;
    resource?: Resource;
    action?: Action;
}

export interface TabItem {
    href: string;
    labelKey: string;
    active: boolean;
    onClick?: () => void;
}

export interface DataRow {
    cells: string[];
    id?: string;
    editable?: boolean;
}

export interface Shift {
    pump: string;
    type: string;
    start: string;
    end: string;
    total: string;
}

export interface Expense {
    amount: string;
    receipt: string;
}

export interface Employee {
    name: string;
    id: string;
    phone: string;
    position: string;
    salary: string;
}
