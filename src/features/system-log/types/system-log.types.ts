export type LogType = 'LOGIN' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'OTHER';

export interface SystemLogEntry {
    id?: string;
    _id?: string;
    date: string;
    time: string;
    email: string;
    adminName: string;
    role: string;
    type: LogType;
    category: string;
    move: string;
    details?: any;
    createdAt?: string;
    updatedAt?: string;
}

export interface LogFilters {
    date: string;
    email?: string;
    type?: LogType | 'ALL';
    category?: string;
}
