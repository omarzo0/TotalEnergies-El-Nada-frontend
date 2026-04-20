import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OilStorage } from '../types/oils.types';
import { oilsApi } from '../api/oils.api';

export function useOilStorage(selectedDate: string) {
    const queryClient = useQueryClient();
    const formattedDate = selectedDate.includes('T') ? selectedDate.split('T')[0] : selectedDate;

    // Fetch storage using TanStack Query
    const {
        data: storage,
        isLoading,
        error
    } = useQuery({
        queryKey: ['oil-storage', formattedDate],
        queryFn: () => oilsApi.getStorage(formattedDate),
        enabled: !!formattedDate,
    });

    // Update storage mutation
    const updateMutation = useMutation({
        mutationFn: (data: { oilName: string; startBalance: number; storageIncoming: number }) =>
            oilsApi.updateStorage({ date: formattedDate, ...data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['oil-storage', formattedDate] });
        }
    });

    // Remove storage mutation
    const removeMutation = useMutation({
        mutationFn: (id: string) => oilsApi.deleteStorage(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['oil-storage', formattedDate] });
        }
    });

    return {
        storage: storage ?? [],
        isLoading,
        error: error ? (error as any).message || "Failed to fetch storage records" : null,
        updateStorage: updateMutation.mutateAsync,
        removeStorage: removeMutation.mutateAsync,
        refresh: () => queryClient.invalidateQueries({ queryKey: ['oil-storage', formattedDate] })
    };
}
