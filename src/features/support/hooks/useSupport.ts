import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportApi, SupportTicket, SupportWarning } from '../api/support.api';

export function useSupport() {
    const queryClient = useQueryClient();

    // --- Tickets ---
    const ticketsQuery = useQuery({
        queryKey: ['support-tickets'],
        queryFn: supportApi.getTickets,
    });

    const createTicketMutation = useMutation({
        mutationFn: (data: Partial<SupportTicket>) => supportApi.createTicket(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
        }
    });

    const addTicketResponseMutation = useMutation({
        mutationFn: ({ id, message }: { id: string; message: string }) => supportApi.addTicketResponse(id, message),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
        }
    });

    const deleteTicketMutation = useMutation({
        mutationFn: (id: string) => supportApi.deleteTicket(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
        }
    });

    // --- Warnings ---
    const warningsQuery = useQuery({
        queryKey: ['support-warnings'],
        queryFn: supportApi.getWarnings,
    });

    const addWarningResponseMutation = useMutation({
        mutationFn: ({ id, message }: { id: string; message: string }) => supportApi.addWarningResponse(id, message),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['support-warnings'] });
        }
    });

    return {
        // Tickets
        tickets: ticketsQuery.data || [],
        isLoadingTickets: ticketsQuery.isLoading,
        createTicket: createTicketMutation.mutateAsync,
        isCreatingTicket: createTicketMutation.isPending,
        addTicketResponse: addTicketResponseMutation.mutateAsync,
        deleteTicket: deleteTicketMutation.mutateAsync,

        // Warnings
        warnings: warningsQuery.data || [],
        isLoadingWarnings: warningsQuery.isLoading,
        addWarningResponse: addWarningResponseMutation.mutateAsync,
        refetchWarnings: warningsQuery.refetch
    };
}
