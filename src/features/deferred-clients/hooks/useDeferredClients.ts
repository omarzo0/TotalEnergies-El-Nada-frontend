import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DeferredClientPayment } from '../types/deferred-clients.types';
import { deferredClientsApi } from '../api/deferred-clients.api';

export function useDeferredClients(selectedDate: string) {
    const queryClient = useQueryClient();
    const formattedDate = selectedDate.includes('T') ? selectedDate.split('T')[0] : selectedDate;

    // Fetch payments using TanStack Query
    const {
        data,
        isLoading,
        error
    } = useQuery({
        queryKey: ['deferred-clients', formattedDate],
        queryFn: () => deferredClientsApi.getPaymentsByDate(formattedDate),
        enabled: !!formattedDate,
    });

    // Add payment mutation
    const addMutation = useMutation({
        mutationFn: (data: Partial<DeferredClientPayment>) =>
            deferredClientsApi.addPayment({ date: formattedDate, ...data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['deferred-clients', formattedDate] });
            // Deferred payments affect the shift diary total
            queryClient.invalidateQueries({ queryKey: ['shift-diary', formattedDate] });
        }
    });

    // Update payment mutation
    const updateMutation = useMutation({
        mutationFn: (variables: { id: string, data: Partial<DeferredClientPayment> }) =>
            deferredClientsApi.updatePayment(variables.id, variables.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['deferred-clients', formattedDate] });
            queryClient.invalidateQueries({ queryKey: ['shift-diary', formattedDate] });
        }
    });

    // Remove payment mutation
    const removeMutation = useMutation({
        mutationFn: (id: string) => deferredClientsApi.deletePayment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['deferred-clients', formattedDate] });
            queryClient.invalidateQueries({ queryKey: ['shift-diary', formattedDate] });
        }
    });

    return {
        payments: data?.data ?? [],
        dailyTotal: data?.total ?? 0,
        isLoading,
        error: error ? (error as any).message || "Failed to fetch deferred clients" : null,
        addPayment: addMutation.mutateAsync,
        updatePayment: (id: string, data: Partial<DeferredClientPayment>) => updateMutation.mutateAsync({ id, data }),
        removePayment: removeMutation.mutateAsync,
        refresh: () => queryClient.invalidateQueries({ queryKey: ['deferred-clients', formattedDate] })
    };
}
