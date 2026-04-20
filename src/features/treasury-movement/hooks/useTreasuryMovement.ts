import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TreasuryMovement, TreasuryMovementFormData, TreasuryMovementSearchFilters } from '../types/treasury-movement.types';
import { treasuryMovementApi } from '../api/treasury-movement.api';

export function useTreasuryMovement(initialFilters: TreasuryMovementSearchFilters, options?: { enabled?: boolean }) {
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState<TreasuryMovementSearchFilters>(initialFilters);

    // Fetch movements using Query
    const {
        data: movements,
        isLoading,
        error
    } = useQuery({
        queryKey: ['treasury-movements', filters],
        queryFn: () => treasuryMovementApi.getMovements(filters),
        enabled: options?.enabled !== false,
    });

    // Mutations
    const addMutation = useMutation({
        mutationFn: (data: TreasuryMovementFormData) => treasuryMovementApi.createMovement(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['treasury-movements'] });
            // Movements affect the safe totals and shift diary
            queryClient.invalidateQueries({ queryKey: ['daily-treasury'] });
            queryClient.invalidateQueries({ queryKey: ['shift-diary'] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: (variables: { id: string, data: TreasuryMovementFormData }) =>
            treasuryMovementApi.updateMovement(variables.id, variables.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['treasury-movements'] });
            queryClient.invalidateQueries({ queryKey: ['daily-treasury'] });
            queryClient.invalidateQueries({ queryKey: ['shift-diary'] });
        }
    });

    const removeMutation = useMutation({
        mutationFn: (id: string) => treasuryMovementApi.deleteMovement(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['treasury-movements'] });
            queryClient.invalidateQueries({ queryKey: ['daily-treasury'] });
            queryClient.invalidateQueries({ queryKey: ['shift-diary'] });
        }
    });

    return {
        movements: movements ?? [],
        isLoading,
        error: error ? (error as any).message || "Failed to fetch movements" : null,
        filters,
        setFilters,
        addMovement: addMutation.mutateAsync,
        updateMovement: (id: string, data: TreasuryMovementFormData) => updateMutation.mutateAsync({ id, data }),
        removeMovement: removeMutation.mutateAsync,
        refresh: () => queryClient.invalidateQueries({ queryKey: ['treasury-movements', filters] })
    };
}
