import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { statementsApi } from '../api/statements.api';

export const useStatements = () => {
    const queryClient = useQueryClient();

    // Fetch Statements using Query
    const {
        data: statements = [],
        isLoading,
        error
    } = useQuery({
        queryKey: ['statements'],
        queryFn: statementsApi.getStatements,
    });

    // Mutations
    const addMutation = useMutation({
        mutationFn: (name: string) => statementsApi.createStatement(name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['statements'] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: (variables: { oldName: string, newName: string }) =>
            statementsApi.updateStatement(variables.oldName, variables.newName),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['statements'] });
        }
    });

    const removeMutation = useMutation({
        mutationFn: (name: string) => statementsApi.deleteStatement(name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['statements'] });
        }
    });

    return {
        statements,
        isLoading,
        error: error ? (error as any).message || 'Failed to fetch statements' : null,
        addStatement: addMutation.mutateAsync,
        updateStatement: (oldName: string, newName: string) => updateMutation.mutateAsync({ oldName, newName }),
        removeStatement: removeMutation.mutateAsync,
        refresh: () => queryClient.invalidateQueries({ queryKey: ['statements'] })
    };
};
