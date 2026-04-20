import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TreasurySummary, TreasuryManualEntry } from '../types/daily-treasury.types';
import { dailyTreasuryApi } from '../api/daily-treasury.api';

export function useDailyTreasury(initialDate?: string) {
    const queryClient = useQueryClient();
    const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
    const formattedDate = date.includes('T') ? date.split('T')[0] : date;

    // Fetch Summary using Query
    const {
        data: summary,
        isLoading,
        error
    } = useQuery({
        queryKey: ['daily-treasury', formattedDate],
        queryFn: () => dailyTreasuryApi.getSummary(formattedDate),
        enabled: !!formattedDate,
    });

    // Mutations
    const islandMutation = useMutation({
        mutationFn: (variables: { quantity: number, price: number }) =>
            dailyTreasuryApi.updateIsland({ date: formattedDate, ...variables }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['daily-treasury', formattedDate] });
            queryClient.invalidateQueries({ queryKey: ['shift-diary', formattedDate] });
        }
    });

    const shiftMutation = useMutation({
        mutationFn: (variables: { quantity: number, price: number }) =>
            dailyTreasuryApi.updateFromShift({ date: formattedDate, ...variables }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['daily-treasury', formattedDate] });
            queryClient.invalidateQueries({ queryKey: ['shift-diary', formattedDate] });
        }
    });

    const entryMutation = useMutation({
        mutationFn: (data: Omit<TreasuryManualEntry, 'id' | 'date'>) =>
            dailyTreasuryApi.createEntry({ ...data, date: formattedDate }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['daily-treasury', formattedDate] });
            queryClient.invalidateQueries({ queryKey: ['shift-diary', formattedDate] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => dailyTreasuryApi.deleteEntry(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['daily-treasury', formattedDate] });
            queryClient.invalidateQueries({ queryKey: ['shift-diary', formattedDate] });
        }
    });

    return {
        summary: summary || null,
        isLoading,
        error: error ? (error as any).message || "Failed to fetch summary" : null,
        date,
        setDate,
        updateIsland: (quantity: number, price: number) => islandMutation.mutateAsync({ quantity, price }),
        updateFromShift: (quantity: number, price: number) => shiftMutation.mutateAsync({ quantity, price }),
        addManualEntry: entryMutation.mutateAsync,
        deleteManualEntry: deleteMutation.mutateAsync,
        refresh: () => queryClient.invalidateQueries({ queryKey: ['daily-treasury', formattedDate] })
    };
}
