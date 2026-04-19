"use client";

import { useState, useEffect, useCallback } from 'react';
import { TreasurySummary, TreasuryManualEntry, TreasuryUpdateData } from '../types/daily-treasury.types';
import { dailyTreasuryApi } from '../api/daily-treasury.api';

export function useDailyTreasury(initialDate?: string) {
    const [summary, setSummary] = useState<TreasurySummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);

    const fetchSummary = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await dailyTreasuryApi.getSummary(date);
            setSummary(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to fetch summary");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [date]);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    const updateIsland = async (quantity: number, price: number) => {
        try {
            await dailyTreasuryApi.updateIsland({ date, quantity, price });
            await fetchSummary();
        } catch (err: any) {
            setError(err.message || "Failed to update island");
            throw err;
        }
    };

    const updateFromShift = async (quantity: number, price: number) => {
        try {
            await dailyTreasuryApi.updateFromShift({ date, quantity, price });
            await fetchSummary();
        } catch (err: any) {
            setError(err.message || "Failed to update shift data");
            throw err;
        }
    };

    const addManualEntry = async (data: Omit<TreasuryManualEntry, 'id' | 'date'>) => {
        try {
            await dailyTreasuryApi.createEntry({ ...data, date });
            await fetchSummary();
        } catch (err: any) {
            setError(err.message || "Failed to create manual entry");
            throw err;
        }
    };

    const deleteManualEntry = async (id: string) => {
        try {
            await dailyTreasuryApi.deleteEntry(id);
            await fetchSummary();
        } catch (err: any) {
            setError(err.message || "Failed to delete entry");
            throw err;
        }
    };

    return {
        summary,
        isLoading,
        error,
        date,
        setDate,
        updateIsland,
        updateFromShift,
        addManualEntry,
        deleteManualEntry,
        refresh: fetchSummary
    };
}
