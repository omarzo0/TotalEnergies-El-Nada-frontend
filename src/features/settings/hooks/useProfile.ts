import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../../auth/api/auth.api';

export function useProfile() {
    const queryClient = useQueryClient();

    // Fetch Profile using Query
    const {
        data: profile,
        isLoading,
        error
    } = useQuery({
        queryKey: ['profile'],
        queryFn: authApi.getMe,
    });

    // Mutation for updating profile
    const updateProfileMutation = useMutation({
        mutationFn: (data: any) => authApi.updateProfile(data),
        onSuccess: (updatedData) => {
            // Update the cache immediately with the new data
            queryClient.setQueryData(['profile'], updatedData);
            // Also invalidate just in case
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        }
    });

    return {
        profile,
        isLoading,
        error: error ? (error as any).message || 'Failed to fetch profile' : null,
        updateProfile: updateProfileMutation.mutateAsync,
        isUpdating: updateProfileMutation.isPending
    };
}
