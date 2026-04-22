import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stationApi, StationData } from '../api/station.api';

export function useStation() {
    const queryClient = useQueryClient();

    const {
        data: station,
        isLoading,
        error
    } = useQuery({
        queryKey: ['station'],
        queryFn: stationApi.getStation,
    });

    const updateStationMutation = useMutation({
        mutationFn: (data: Partial<StationData>) => stationApi.updateStation(data),
        onSuccess: (updatedData) => {
            queryClient.setQueryData(['station'], updatedData);
            queryClient.invalidateQueries({ queryKey: ['station'] });
        }
    });

    return {
        station,
        isLoading,
        error: error ? (error as any).message || 'Failed to fetch station details' : null,
        updateStation: updateStationMutation.mutateAsync,
        isUpdating: updateStationMutation.isPending
    };
}
