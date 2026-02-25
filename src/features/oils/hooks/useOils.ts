"use client";

import { useState, useEffect, useCallback } from 'react';
import { OilRecord, OilRecordType } from '../types/oils.types';
import { oilsApi } from '../api/oils.api';

export function useOils(type: OilRecordType) {
    const [records, setRecords] = useState<OilRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRecords = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await oilsApi.getRecords(type);
            setRecords(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch oil records");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [type]);

    const addRecord = async (data: Partial<OilRecord>) => {
        try {
            const newRecord = await oilsApi.createRecord(type, data);
            setRecords(prev => [...prev, newRecord]);
            return newRecord;
        } catch (err) {
            setError("Failed to add record");
            throw err;
        }
    };

    const updateRecord = async (oilType: string, data: Partial<OilRecord>) => {
        try {
            const updated = await oilsApi.updateRecord(type, oilType, data);
            setRecords(prev => prev.map(r => r.oilType === oilType ? updated : r));
            return updated;
        } catch (err) {
            setError("Failed to update record");
            throw err;
        }
    };

    const removeRecord = async (oilType: string) => {
        try {
            await oilsApi.deleteRecord(type, oilType);
            setRecords(prev => prev.filter(r => r.oilType !== oilType));
        } catch (err) {
            setError("Failed to delete record");
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
