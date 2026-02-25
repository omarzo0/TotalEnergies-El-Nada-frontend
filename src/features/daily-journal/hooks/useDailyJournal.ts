"use client";

import { useState, useEffect, useCallback } from 'react';
import { DailyJournalRecord, DailyJournalFormData } from '../types/daily-journal.types';
import { dailyJournalApi } from '../api/daily-journal.api';

export function useDailyJournal() {
    const [records, setRecords] = useState<DailyJournalRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRecords = useCallback(async () => {
        setIsLoading(true);
        const data = await dailyJournalApi.getRecords();
        setRecords(data);
        setIsLoading(false);
    }, []);

    const addRecord = async (data: DailyJournalFormData) => {
        const newRecord = await dailyJournalApi.createRecord(data);
        setRecords(prev => [newRecord, ...prev]);
        return newRecord;
    };

    const updateRecord = async (id: string, data: Partial<DailyJournalRecord>) => {
        const updated = await dailyJournalApi.updateRecord(id, data);
        setRecords(prev => prev.map(r => r.id === id ? updated : r));
        return updated;
    };

    const removeRecord = async (id: string) => {
        const success = await dailyJournalApi.deleteRecord(id);
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
