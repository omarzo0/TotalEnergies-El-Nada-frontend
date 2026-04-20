import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { VoucherRecord, VoucherMatchingRecord, FuelType } from '../types/vouchers.types';
import { vouchersApi } from '../api/vouchers.api';

export function useVouchers(
    date?: string,
    pumpType?: FuelType,
    filters?: { pumpType?: FuelType, side?: string },
    options: { fetchVouchers?: boolean; fetchMatching?: boolean } = { fetchVouchers: true, fetchMatching: true }
) {
    const queryClient = useQueryClient();
    const formattedDate = date ? (date.includes('T') ? date.split('T')[0] : date) : undefined;

    // 1. Fetch Vouchers List
    const vouchersQuery = useQuery({
        queryKey: ['vouchers', formattedDate, pumpType],
        queryFn: () => vouchersApi.getVouchers(formattedDate!, pumpType),
        enabled: !!formattedDate && options.fetchVouchers !== false,
    });

    // 2. Fetch Matching Records
    const matchingRecordsQuery = useQuery({
        queryKey: ['matching-records', formattedDate, filters],
        queryFn: () => vouchersApi.getMatchingRecords(formattedDate!, filters),
        enabled: !!formattedDate && options.fetchMatching !== false,
    });

    // 3. Fetch Matching Total
    const matchingTotalQuery = useQuery({
        queryKey: ['matching-total', formattedDate, filters],
        queryFn: () => vouchersApi.getMatchingTotal(formattedDate!, filters),
        enabled: !!formattedDate && options.fetchMatching !== false,
    });

    // Mutations
    const addMutation = useMutation({
        mutationFn: (data: Partial<VoucherRecord>) => vouchersApi.createVoucher(data),
        onSuccess: (_, variables) => {
            const vDate = variables.date ? (variables.date.includes('T') ? variables.date.split('T')[0] : variables.date) : formattedDate;
            queryClient.invalidateQueries({ queryKey: ['vouchers', vDate] });
            queryClient.invalidateQueries({ queryKey: ['matching-records', vDate] });
            queryClient.invalidateQueries({ queryKey: ['matching-total', vDate] });
            // Vouchers also affect shift diary totals
            queryClient.invalidateQueries({ queryKey: ['shift-diary', vDate] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: (variables: { id: string, data: Partial<VoucherRecord> }) =>
            vouchersApi.updateVoucher(variables.id, variables.data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['vouchers', formattedDate] });
            queryClient.invalidateQueries({ queryKey: ['matching-records', formattedDate] });
            queryClient.invalidateQueries({ queryKey: ['matching-total', formattedDate] });
            queryClient.invalidateQueries({ queryKey: ['shift-diary', formattedDate] });
        }
    });

    const removeMutation = useMutation({
        mutationFn: (id: string) => vouchersApi.deleteVoucher(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vouchers', formattedDate] });
            queryClient.invalidateQueries({ queryKey: ['matching-records', formattedDate] });
            queryClient.invalidateQueries({ queryKey: ['matching-total', formattedDate] });
            queryClient.invalidateQueries({ queryKey: ['shift-diary', formattedDate] });
        }
    });

    return {
        vouchers: vouchersQuery.data ?? [],
        matchingRecords: matchingRecordsQuery.data ?? [],
        matchingTotal: matchingTotalQuery.data ?? 0,
        isLoading: vouchersQuery.isLoading || matchingRecordsQuery.isLoading || matchingTotalQuery.isLoading,
        isActionLoading: addMutation.isPending || updateMutation.isPending || removeMutation.isPending,
        error: (vouchersQuery.error || matchingRecordsQuery.error || matchingTotalQuery.error || addMutation.error || updateMutation.error || removeMutation.error)
            ? ((vouchersQuery.error || matchingRecordsQuery.error || matchingTotalQuery.error || addMutation.error || updateMutation.error || removeMutation.error) as any).message
            : null,
        addVoucher: addMutation.mutateAsync,
        updateVoucher: (id: string, data: Partial<VoucherRecord>) => updateMutation.mutateAsync({ id, data }),
        removeVoucher: removeMutation.mutateAsync,
        refresh: () => {
            queryClient.invalidateQueries({ queryKey: ['vouchers', formattedDate] });
            queryClient.invalidateQueries({ queryKey: ['matching-records', formattedDate] });
            queryClient.invalidateQueries({ queryKey: ['matching-total', formattedDate] });
        }
    };
}

