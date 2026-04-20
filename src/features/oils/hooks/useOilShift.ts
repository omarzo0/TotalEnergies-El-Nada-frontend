import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OilShift } from '../types/oils.types';
import { oilsApi } from '../api/oils.api';

export function useOilShift(selectedDate: string) {
    const queryClient = useQueryClient();
    const formattedDate = selectedDate.includes('T') ? selectedDate.split('T')[0] : selectedDate;

    // Fetch shift sales using TanStack Query
    const {
        data: shiftSales,
        isLoading,
        error
    } = useQuery({
        queryKey: ['oil-shift', formattedDate],
        queryFn: () => oilsApi.getShiftSales(formattedDate),
        enabled: !!formattedDate,
    });

    // Update shift sale mutation
    const updateMutation = useMutation({
        mutationFn: (data: { oilName: string; firstTermBalance: number; endTermBalance: number; incoming: number }) =>
            oilsApi.updateShiftSales({ date: formattedDate, ...data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['oil-shift', formattedDate] });
            // Also invalidate shift diary as oil sales affect it
            queryClient.invalidateQueries({ queryKey: ['shift-diary', formattedDate] });
        }
    });

    // Remove shift sale mutation
    const removeMutation = useMutation({
        mutationFn: (id: string) => oilsApi.deleteShiftSales(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['oil-shift', formattedDate] });
            queryClient.invalidateQueries({ queryKey: ['shift-diary', formattedDate] });
        }
    });

    return {
        shiftSales: shiftSales ?? [],
        isLoading,
        error: error ? (error as any).message || "Failed to fetch shift sales" : null,
        updateShiftSales: updateMutation.mutateAsync,
        removeShiftSale: removeMutation.mutateAsync,
        refresh: () => queryClient.invalidateQueries({ queryKey: ['oil-shift', formattedDate] })
    };
}
