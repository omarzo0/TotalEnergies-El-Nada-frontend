import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminsApi } from '../api/admins.api';

export function useAdmins() {
    const queryClient = useQueryClient();

    // Fetch Admins using Query
    const {
        data: admins = [],
        isLoading,
        error
    } = useQuery({
        queryKey: ['admins'],
        queryFn: adminsApi.getAll,
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: (data: any) => adminsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admins'] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: (variables: { id: string, data: any }) =>
            adminsApi.update(variables.id, variables.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admins'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => adminsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admins'] });
        }
    });

    return {
        admins,
        isLoading,
        error: error ? (error as any).message || 'Failed to fetch admins' : null,
        createAdmin: createMutation.mutateAsync,
        updateAdmin: (id: string, data: any) => updateMutation.mutateAsync({ id, data }),
        deleteAdmin: deleteMutation.mutateAsync,
        refresh: () => queryClient.invalidateQueries({ queryKey: ['admins'] })
    };
}
