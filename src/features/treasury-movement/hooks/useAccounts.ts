import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Account, AccountFormData, AccountSearchFilters } from '../types/treasury-movement.types';
import { accountsApi } from '../api/accounts.api';

export function useAccounts(initialFilters: AccountSearchFilters, options?: { enabled?: boolean }) {
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState<AccountSearchFilters>(initialFilters);

    // Fetch accounts using Query
    const {
        data: accounts,
        isLoading,
        error
    } = useQuery({
        queryKey: ['accounts', filters],
        queryFn: () => accountsApi.getAccounts(filters),
        enabled: options?.enabled !== false,
    });

    // Mutations
    const addMutation = useMutation({
        mutationFn: (data: AccountFormData) => accountsApi.createAccount(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            // Accounts are often used as labels in treasury movements
            queryClient.invalidateQueries({ queryKey: ['treasury-movements'] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: (variables: { id: string, data: AccountFormData }) =>
            accountsApi.updateAccount(variables.id, variables.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['treasury-movements'] });
        }
    });

    const removeMutation = useMutation({
        mutationFn: (id: string) => accountsApi.deleteAccount(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['treasury-movements'] });
        }
    });

    return {
        accounts: accounts ?? [],
        isLoading,
        error: error ? (error as any).message || "Failed to fetch accounts" : null,
        filters,
        setFilters,
        addAccount: addMutation.mutateAsync,
        updateAccount: (id: string, data: AccountFormData) => updateMutation.mutateAsync({ id, data }),
        removeAccount: removeMutation.mutateAsync,
        refresh: () => queryClient.invalidateQueries({ queryKey: ['accounts', filters] })
    };
}
