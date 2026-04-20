import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Oil } from '../types/oils.types';
import { oilsApi } from '../api/oils.api';

export function useOils() {
    const queryClient = useQueryClient();

    // Fetch oils using TanStack Query
    const {
        data: oils,
        isLoading,
        error
    } = useQuery({
        queryKey: ['oils'],
        queryFn: oilsApi.getAllOils,
        staleTime: 1000 * 60 * 10, // Oils list changes rarely
    });

    // Add oil mutation
    const addMutation = useMutation({
        mutationFn: (data: { oilName: string; price: number; date: string }) => oilsApi.addOil(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['oils'] });
        }
    });

    return {
        oils: oils ?? [],
        isLoading,
        error: error ? (error as any).message || "Failed to fetch oils" : null,
        addOil: addMutation.mutateAsync,
        refresh: () => queryClient.invalidateQueries({ queryKey: ['oils'] })
    };
}
