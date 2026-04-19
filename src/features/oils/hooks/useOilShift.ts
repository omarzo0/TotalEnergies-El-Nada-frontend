"use client";

import { useState, useEffect, useCallback } from 'react';
import { OilShift } from '../types/oils.types';
import { oilsApi } from '../api/oils.api';

export function useOilShift(selectedDate: string) {
    const [shiftSales, setShiftSales] = useState<OilShift[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchShiftSales = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await oilsApi.getShiftSales(selectedDate);
            setShiftSales(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to fetch shift sales");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDate]);

    const updateShiftSales = async (data: { oilName: string; firstTermBalance: number; endTermBalance: number; incoming: number }) => {
        try {
            await oilsApi.updateShiftSales({ date: selectedDate, ...data });
            await fetchShiftSales();
        } catch (err: any) {
            setError(err.message || "Failed to update shift sales");
            throw err;
        }
    };

    const removeShiftSale = async (id: string) => {
        try {
            await oilsApi.deleteShiftSales(id);
            await fetchShiftSales();
        } catch (err: any) {
            setError(err.message || "Failed to delete shift sale record");
            throw err;
        }
    };

    useEffect(() => {
        fetchShiftSales();
    }, [fetchShiftSales]);

    return {
        shiftSales,
        isLoading,
        error,
        updateShiftSales,
        removeShiftSale,
        refresh: fetchShiftSales
    };
}
