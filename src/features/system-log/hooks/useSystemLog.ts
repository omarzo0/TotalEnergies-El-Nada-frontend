"use client";

import { useState, useEffect, useCallback } from 'react';
import { SystemLogEntry } from '../types/system-log.types';
import { systemLogApi } from '../api/system-log.api';

export function useSystemLog() {
    const [logs, setLogs] = useState<SystemLogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLogs = useCallback(async () => {
        setIsLoading(true);
        const data = await systemLogApi.getLogs();
        setLogs(data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    return {
        logs,
        isLoading,
        refresh: fetchLogs
    };
}
