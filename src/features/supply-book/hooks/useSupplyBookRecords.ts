import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SupplyBookRecord } from '../types/supply-book.types';
import { supplyBookApi } from '../api/supply-book.api';

export function useSupplyBookRecords(selectedDate: string, benzTypeFilter?: string) {
    const queryClient = useQueryClient();
    const formattedDate = selectedDate.includes('T') ? selectedDate.split('T')[0] : selectedDate;

    // Fetch records using Query
    const {
        data: records,
        isLoading,
        error
    } = useQuery({
        queryKey: ['supply-book-records', formattedDate, benzTypeFilter],
        queryFn: () => supplyBookApi.getRecordsByDate(formattedDate, benzTypeFilter),
        enabled: !!formattedDate,
    });

    // Mutations
    const addMutation = useMutation({
        mutationFn: (data: Partial<SupplyBookRecord>) =>
            supplyBookApi.createRecord({ date: formattedDate, ...data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['supply-book-records', formattedDate] });
            // Supply book records appear in the shift diary
            queryClient.invalidateQueries({ queryKey: ['shift-diary', formattedDate] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data: Partial<SupplyBookRecord>) => supplyBookApi.updateRecord(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['supply-book-records', formattedDate] });
            queryClient.invalidateQueries({ queryKey: ['shift-diary', formattedDate] });
        }
    });

    const removeMutation = useMutation({
        mutationFn: (id: string) => supplyBookApi.deleteRecord(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['supply-book-records', formattedDate] });
            queryClient.invalidateQueries({ queryKey: ['shift-diary', formattedDate] });
        }
    });

    return {
        records: records ?? [],
        isLoading,
        error: error ? (error as any).message || "Failed to fetch records" : null,
        addRecord: addMutation.mutateAsync,
        updateRecord: updateMutation.mutateAsync,
        removeRecord: removeMutation.mutateAsync,
        refresh: () => queryClient.invalidateQueries({ queryKey: ['supply-book-records', formattedDate] })
    };
}
