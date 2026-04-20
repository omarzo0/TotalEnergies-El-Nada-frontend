import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shiftDiaryApi } from '../api/shift-diary.api';

export function useShiftDiary(initialDate: string) {
    const [date, setDate] = useState(initialDate);
    const queryClient = useQueryClient();

    // Fetch summary using TanStack Query
    const {
        data: summary,
        isLoading,
        error
    } = useQuery({
        queryKey: ['shift-diary', date],
        queryFn: () => shiftDiaryApi.getByDate(date),
        enabled: !!date,
    });

    // Update transfer/priceDiff using TanStack Mutation
    const mutation = useMutation({
        mutationFn: (variables: { type: string, statement: string, transfer: number, priceDiff: number }) =>
            shiftDiaryApi.updateNa2lFr2({ date, ...variables }),

        onSuccess: () => {
            // Invalidate the cache for this date to trigger a refetch
            queryClient.invalidateQueries({ queryKey: ['shift-diary', date] });
        }
    });

    return {
        summary: summary ?? null,
        isLoading,
        error: error ? (error as any).message || "Failed to fetch shift summary" : null,
        date,
        setDate,
        updateNa2lFr2: mutation.mutateAsync,
        refresh: () => queryClient.invalidateQueries({ queryKey: ['shift-diary', date] })
    };
}
