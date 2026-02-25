export interface User {
    username: string;
    loggedInAt: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
}

export interface NavItem {
    key: string;
    href: string;
    icon: string;
}

export interface TabItem {
    href: string;
    labelKey: string;
    active: boolean;
}

export interface DataRow {
    cells: string[];
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
