"use client";

import { useState, useEffect, useCallback } from 'react';
import { SupplyBookRecord } from '../types/supply-book.types';
import { supplyBookApi } from '../api/supply-book.api';

export function useSupplyBookRecords() {
    const [records, setRecords] = useState<SupplyBookRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRecords = useCallback(async () => {
        setIsLoading(true);
        const data = await supplyBookApi.getRecords();
        setRecords(data);
        setIsLoading(false);
    }, []);

    const addRecord = async (data: Partial<SupplyBookRecord>) => {
        const newRecord = await supplyBookApi.createRecord(data);
        setRecords(prev => [newRecord, ...prev]);
        return newRecord;
    };

    const updateRecord = async (id: string, data: Partial<SupplyBookRecord>) => {
        const updated = await supplyBookApi.updateRecord(id, data);
        setRecords(prev => prev.map(r => r.id === id ? updated : r));
        return updated;
    };

    const removeRecord = async (id: string) => {
        const success = await supplyBookApi.deleteRecord(id);
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
