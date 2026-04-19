"use client";

import { useState, useEffect, useCallback } from 'react';
import { SystemLogEntry, LogFilters, LogType } from '../types/system-log.types';
import { systemLogApi } from '../api/system-log.api';

export function useSystemLog() {
    const [logs, setLogs] = useState<SystemLogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [email, setEmail] = useState("");
    const [type, setType] = useState<LogType | 'ALL'>('ALL');
    const [category, setCategory] = useState("");

    const fetchLogs = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await systemLogApi.getLogsByDate(date, {
                email: email || undefined,
                type: type === 'ALL' ? undefined : type,
                category: category || undefined
            });
            setLogs(data || []);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to fetch logs");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [date, email, type, category]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    return {
        logs,
        isLoading,
        error,
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
        refresh: fetchLogs
    };
}
