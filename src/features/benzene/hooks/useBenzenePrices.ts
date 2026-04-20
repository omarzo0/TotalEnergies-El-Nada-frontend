import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BenzenePrices } from "../types/benzene.types";
import { benzeneApi } from "../api/benzene.api";

export function useBenzenePrices(selectedDate: string) {
    const queryClient = useQueryClient();
    const formattedDate = selectedDate.includes('T') ? selectedDate.split('T')[0] : selectedDate;

    // Fetch prices using TanStack Query
    const {
        data: prices,
        isLoading,
        error
    } = useQuery({
        queryKey: ["benzene-prices", formattedDate],
        queryFn: () => benzeneApi.getPrices(formattedDate),
        enabled: !!formattedDate,
    });

    // Save prices mutation
    const saveMutation = useMutation({
        mutationFn: (data: BenzenePrices) => benzeneApi.updatePrices(formattedDate, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["benzene-prices", formattedDate] });
            // Also invalidate shift diary as prices affect it
            queryClient.invalidateQueries({ queryKey: ["shift-diary", formattedDate] });
        }
    });

    // Delete prices mutation
    const deleteMutation = useMutation({
        mutationFn: () => benzeneApi.deletePrices(formattedDate),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["benzene-prices", formattedDate] });
            queryClient.invalidateQueries({ queryKey: ["shift-diary", formattedDate] });
        }
    });

    return {
        prices: prices ?? null,
        isLoading,
        isSaving: saveMutation.isPending || deleteMutation.isPending,
        error: error ? (error as any).message || "Failed to fetch prices" : null,
        savePrices: saveMutation.mutateAsync,
        deletePrices: deleteMutation.mutateAsync,
        refetch: () => queryClient.invalidateQueries({ queryKey: ["benzene-prices", formattedDate] })
    };
}
