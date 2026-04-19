"use client";

import { useState, useEffect, useCallback } from 'react';
import { OilStorage } from '../types/oils.types';
import { oilsApi } from '../api/oils.api';

export function useOilStorage(selectedDate: string) {
    const [storage, setStorage] = useState<OilStorage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStorage = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await oilsApi.getStorage(selectedDate);
            setStorage(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to fetch storage records");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDate]);

    const updateStorage = async (data: { oilName: string; startBalance: number; storageIncoming: number }) => {
        try {
            await oilsApi.updateStorage({ date: selectedDate, ...data });
            await fetchStorage();
        } catch (err: any) {
            setError(err.message || "Failed to update storage");
            throw err;
        }
    };

    const removeStorage = async (id: string) => {
        try {
            await oilsApi.deleteStorage(id);
            await fetchStorage();
        } catch (err: any) {
            setError(err.message || "Failed to delete storage record");
            throw err;
        }
    };

    useEffect(() => {
        fetchStorage();
    }, [fetchStorage]);

    return {
        storage,
        isLoading,
        error,
        updateStorage,
        removeStorage,
        refresh: fetchStorage
    };
}
