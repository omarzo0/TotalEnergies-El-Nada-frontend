import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StandardUpdatePayload } from '../types/supply-book.types';
import { supplyBookApi } from '../api/supply-book.api';

export function useBalanceMatching(selectedMonth: number, selectedDate: string) {
    const queryClient = useQueryClient();
    const formattedDate = selectedDate.includes('T') ? selectedDate.split('T')[0] : selectedDate;

    // Fetch Monthly Balance using Query
    const {
        data: balanceData,
        isLoading: isBalanceLoading,
        error: balanceError
    } = useQuery({
        queryKey: ['supply-book-balance', selectedMonth],
        queryFn: () => supplyBookApi.getMonthlyBalance(selectedMonth),
        enabled: !!selectedMonth,
    });

    // Fetch Standard Gauges using Query
    const {
        data: gauges,
        isLoading: isGaugesLoading,
        error: gaugesError
    } = useQuery({
        queryKey: ['supply-book-standard', formattedDate],
        queryFn: () => supplyBookApi.getStandardByDate(formattedDate),
        enabled: !!formattedDate,
    });

    // Mutations
    const updateMutation = useMutation({
        mutationFn: (data: StandardUpdatePayload) => supplyBookApi.updateStandard(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['supply-book-standard', formattedDate] });
            // Updating standard might affect the monthly balance calculations
            queryClient.invalidateQueries({ queryKey: ['supply-book-balance', selectedMonth] });
        }
    });

    const resetMutation = useMutation({
        mutationFn: (date: string) => supplyBookApi.resetStandard(date),
        onSuccess: (_, variables) => {
            const dateOnly = variables.split('T')[0];
            queryClient.invalidateQueries({ queryKey: ['supply-book-standard', dateOnly] });
            queryClient.invalidateQueries({ queryKey: ['supply-book-balance', selectedMonth] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (variables: { month: number, benzType?: string }) =>
            supplyBookApi.deleteBalance(variables.month, variables.benzType),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['supply-book-balance', selectedMonth] });
        }
    });

    const isLoading = isBalanceLoading || isGaugesLoading;
    const error = (balanceError || gaugesError) ? "Failed to fetch supply book data" : null;

    return {
        balanceData: balanceData ?? {},
        gauges: gauges ?? {},
        isLoading,
        error,
        updateStandard: updateMutation.mutateAsync,
        resetStandard: resetMutation.mutateAsync,
        deleteBalance: (month: number, benzType?: string) => deleteMutation.mutateAsync({ month, benzType }),
        refresh: () => {
            queryClient.invalidateQueries({ queryKey: ['supply-book-balance', selectedMonth] });
            queryClient.invalidateQueries({ queryKey: ['supply-book-standard', formattedDate] });
        }
    };
}
