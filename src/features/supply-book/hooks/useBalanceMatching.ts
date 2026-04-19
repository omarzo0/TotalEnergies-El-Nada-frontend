"use client";

import { useState, useEffect, useCallback } from 'react';
import { MonthlyBalanceResponse, StandardGaugesResponse, StandardUpdatePayload } from '../types/supply-book.types';
import { supplyBookApi } from '../api/supply-book.api';

export function useBalanceMatching(selectedMonth: number, selectedDate: string) {
    const [balanceData, setBalanceData] = useState<MonthlyBalanceResponse>({});
    const [gauges, setGauges] = useState<StandardGaugesResponse>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [balance, standardData] = await Promise.all([
                supplyBookApi.getMonthlyBalance(selectedMonth),
                supplyBookApi.getStandardByDate(selectedDate)
            ]);
            setBalanceData(balance);
            setGauges(standardData);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to fetch balance data");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [selectedMonth, selectedDate]);

    const updateStandard = async (data: StandardUpdatePayload) => {
        try {
            await supplyBookApi.updateStandard(data);
            await fetchData();
        } catch (err: any) {
            setError(err.message || "Failed to update standard");
            throw err;
        }
    };

    const resetStandard = async (date: string) => {
        try {
            await supplyBookApi.resetStandard(date);
            await fetchData();
        } catch (err: any) {
            setError(err.message || "Failed to reset standard");
            throw err;
        }
    };

    const deleteBalance = async (month: number, benzType?: string) => {
        try {
            const count = await supplyBookApi.deleteBalance(month, benzType);
            await fetchData();
            return count;
        } catch (err: any) {
            setError(err.message || "Failed to delete balance");
            throw err;
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        balanceData,
        gauges,
        isLoading,
        error,
        updateStandard,
        resetStandard,
        deleteBalance,
        refresh: fetchData
    };
}
