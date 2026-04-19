import { useState, useEffect } from 'react';
import { ShiftDiarySummary } from '../types/shift-diary.types';
import { shiftDiaryApi } from '../api/shift-diary.api';

export function useShiftDiary(initialDate: string) {
    const [summary, setSummary] = useState<ShiftDiarySummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [date, setDate] = useState(initialDate);

    const fetchSummary = async (targetDate: string) => {
        try {
            setIsLoading(true);
            const data = await shiftDiaryApi.getByDate(targetDate);
            setSummary(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to fetch shift summary");
            setSummary(null);
        } finally {
            setIsLoading(false);
        }
    };

    const updateNa2lFr2 = async (type: string, statement: string, na2l: number, fr2s3r: number) => {
        try {
            await shiftDiaryApi.updateNa2lFr2({ date, type, statement, na2l, fr2s3r });
            // Refresh summary after update
            await fetchSummary(date);
        } catch (err: any) {
            setError(err.message || "Failed to update record");
            throw err;
        }
    };

    useEffect(() => {
        if (date) {
            fetchSummary(date);
        }
    }, [date]);

    return {
        summary,
        isLoading,
        error,
        date,
        setDate,
        updateNa2lFr2,
        refresh: () => fetchSummary(date)
    };
}
