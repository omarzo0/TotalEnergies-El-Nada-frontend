import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LogType } from '../types/system-log.types';
import { systemLogApi } from '../api/system-log.api';

export function useSystemLog() {
    const queryClient = useQueryClient();

    // Filter states
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [email, setEmail] = useState("");
    const [type, setType] = useState<LogType | 'ALL'>('ALL');
    const [category, setCategory] = useState("");

    // Fetch Logs using Query
    const {
        data: logs,
        isLoading,
        error
    } = useQuery({
        queryKey: ['system-logs', date, { email, type, category }],
        queryFn: () => systemLogApi.getLogsByDate(date, {
            email: email || undefined,
            type: type === 'ALL' ? undefined : type,
            category: category || undefined
        }),
        enabled: !!date,
    });

    return {
        logs: logs || [],
        isLoading,
        error: error ? (error as any).message || "Failed to fetch logs" : null,
        filters: {
            date,
            email,
            type,
            category
        },
        setFilters: {
            setDate,
            setEmail,
            setType,
            setCategory
        },
        refresh: () => queryClient.invalidateQueries({ queryKey: ['system-logs', date] })
    };
}
