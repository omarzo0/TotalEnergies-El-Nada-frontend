"use client";

import { useState, useEffect, useCallback } from 'react';
import { TreasuryRecord } from '../types/treasury-diary.types';
import { treasuryDiaryApi } from '../api/treasury-diary.api';

export function useTreasuryDiary() {
    const [records, setRecords] = useState<TreasuryRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRecords = useCallback(async () => {
        setIsLoading(true);
        const data = await treasuryDiaryApi.getRecords();
        setRecords(data);
        setIsLoading(false);
    }, []);

    const addRecord = async (data: Partial<TreasuryRecord>) => {
        const newRecord = await treasuryDiaryApi.createRecord(data);
        setRecords(prev => [...prev, newRecord]);
        return newRecord;
    };

    const updateRecord = async (id: string, data: Partial<TreasuryRecord>) => {
        const updated = await treasuryDiaryApi.updateRecord(id, data);
        setRecords(prev => prev.map(r => r.id === id ? updated : r));
        return updated;
    };

    const removeRecord = async (id: string) => {
        const success = await treasuryDiaryApi.deleteRecord(id);
        if (success) {
            setRecords(prev => prev.filter(r => r.id !== id));
        }
        return success;
    };

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    return {
        records,
        isLoading,
        addRecord,
        updateRecord,
        removeRecord,
        refresh: fetchRecords
    };
}
