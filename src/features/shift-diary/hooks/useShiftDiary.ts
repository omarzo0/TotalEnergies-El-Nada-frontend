"use client";

import { useState, useEffect } from 'react';
import { ShiftRecord } from '../types/shift-diary.types';
import { shiftDiaryApi } from '../api/shift-diary.api';

export function useShiftDiary() {
    const [shifts, setShifts] = useState<ShiftRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchShifts = async () => {
        try {
            setIsLoading(true);
            const data = await shiftDiaryApi.getShifts();
            setShifts(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch shift records");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const addShift = async (data: Partial<ShiftRecord>) => {
        try {
            const newRecord = await shiftDiaryApi.createShift(data);
            // In a real app we'd refresh or the backend would return the full object
            // Here we just update local state for the PoC
            setShifts(prev => [...prev, { ...data } as ShiftRecord]);
            return newRecord;
        } catch (err) {
            setError("Failed to add shift record");
            throw err;
        }
    };

    const editShift = async (pumpId: string, data: Partial<ShiftRecord>) => {
        try {
            await shiftDiaryApi.updateShift(pumpId, data);
            setShifts(prev => prev.map(s => s.pump === pumpId ? { ...s, ...data } : s));
        } catch (err) {
            setError("Failed to update shift record");
            throw err;
        }
    };

    const removeShift = async (pumpId: string) => {
        try {
            await shiftDiaryApi.deleteShift(pumpId);
            setShifts(prev => prev.filter(s => s.pump !== pumpId));
        } catch (err) {
            setError("Failed to delete shift record");
            throw err;
        }
    };

    useEffect(() => {
        fetchShifts();
    }, []);

    return {
        shifts,
        isLoading,
        error,
        addShift,
        editShift,
        removeShift,
        refresh: fetchShifts
    };
}
