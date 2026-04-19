"use client";

import { useState, useEffect, useCallback } from 'react';
import { SupplyBookRecord } from '../types/supply-book.types';
import { supplyBookApi } from '../api/supply-book.api';

export function useSupplyBookRecords(selectedDate: string, benzTypeFilter?: string) {
    const [records, setRecords] = useState<SupplyBookRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRecords = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await supplyBookApi.getRecordsByDate(selectedDate, benzTypeFilter);
            setRecords(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to fetch records");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDate, benzTypeFilter]);

    const addRecord = async (data: Partial<SupplyBookRecord>) => {
        try {
            const newRecord = await supplyBookApi.createRecord({ date: selectedDate, ...data });
            await fetchRecords();
            return newRecord;
        } catch (err: any) {
            setError(err.message || "Failed to add record");
            throw err;
        }
    };

    const updateRecord = async (data: Partial<SupplyBookRecord>) => {
        try {
            const updated = await supplyBookApi.updateRecord(data);
            await fetchRecords();
            return updated;
        } catch (err: any) {
            setError(err.message || "Failed to update record");
            throw err;
        }
    };

    const removeRecord = async (id: string) => {
        try {
            await supplyBookApi.deleteRecord(id);
            await fetchRecords();
        } catch (err: any) {
            setError(err.message || "Failed to delete record");
            throw err;
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    return {
        records,
        isLoading,
        error,
        addRecord,
        updateRecord,
        removeRecord,
        refresh: fetchRecords
    };
}
