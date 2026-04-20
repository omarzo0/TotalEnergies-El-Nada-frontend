import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BenzeneRecord, BenzeneRecordType } from "../types/benzene.types";
import { benzeneApi } from "../api/benzene.api";

export function useBenzene(type: BenzeneRecordType, selectedDate: string, options: { fetchPrices?: boolean } = {}) {
    const queryClient = useQueryClient();
    const formattedDate = selectedDate.includes('T') ? selectedDate.split('T')[0] : selectedDate;

    const typeToPriceKey: Record<string, string> = useMemo(() => {
        return {
            "solar": "solarPrice",
            "ben80": "ben80Price",
            "ben92": "ben92Price",
            "ben95": "ben95Price"
        };
    }, []);

    // 1. Fetch Pump Readings
    const readingsQuery = useQuery({
        queryKey: ["benzene-readings", formattedDate],
        queryFn: () => benzeneApi.getPumpReadings(formattedDate),
        enabled: !!formattedDate,
    });

    // 2. Fetch Prices (Conditional: only when requested, e.g. when price tab is active)
    const pricesQuery = useQuery({
        queryKey: ["benzene-prices", formattedDate],
        queryFn: () => benzeneApi.getPrices(formattedDate),
        enabled: !!formattedDate && options.fetchPrices === true,
    });

    // 3. Map Data (Memoized derived state)
    const records = useMemo(() => {
        if (!readingsQuery.data) return [];

        const readingsData = readingsQuery.data;
        const pricesData = pricesQuery.data;

        return readingsData.map((r: any, index: number) => {
            const pumpType = (r.pumpType || r.trumbaType || (r as any).benzType || "").trim();
            const pumpNumber = r.pumpNumber || r.trumbaNumber || 0;

            const priceKey = typeToPriceKey[pumpType.toLowerCase()];
            const apiPrice = priceKey && pricesData ? (pricesData as any)[priceKey] : 0;
            const finalPrice = apiPrice > 0 ? apiPrice : (r.price || 0);

            return {
                id: r._id || `record-${index}`,
                pumpType: pumpType,
                pumpNumber: pumpNumber,
                startBalance: r.start,
                endBalance: r.end,
                liters: r.liters,
                price: finalPrice,
                totalAmount: r.totalAmount || (r.liters * finalPrice),
                date: r.date.split('T')[0]
            } as BenzeneRecord;
        });
    }, [readingsQuery.data, pricesQuery.data, typeToPriceKey]);

    // 4. Mutations
    const addMutation = useMutation({
        mutationFn: (data: any) => benzeneApi.createPumpReading(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["benzene-readings", formattedDate] });
            queryClient.invalidateQueries({ queryKey: ["shift-diary", formattedDate] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) =>
            benzeneApi.updatePumpReading(id, { start: data.start, end: data.end }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["benzene-readings", formattedDate] });
            queryClient.invalidateQueries({ queryKey: ["shift-diary", formattedDate] });
        }
    });

    const removeMutation = useMutation({
        mutationFn: (id: string) => benzeneApi.deletePumpReading(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["benzene-readings", formattedDate] });
            queryClient.invalidateQueries({ queryKey: ["shift-diary", formattedDate] });
        }
    });

    return {
        records,
        isLoading: readingsQuery.isLoading || pricesQuery.isLoading,
        error: (readingsQuery.error || pricesQuery.error) ? "Failed to fetch data" : null,
        addRecord: addMutation.mutateAsync,
        updateRecord: (id: string, data: any) => updateMutation.mutateAsync({ id, data }),
        removeRecord: removeMutation.mutateAsync,
        refresh: () => {
            queryClient.invalidateQueries({ queryKey: ["benzene-readings", formattedDate] });
            queryClient.invalidateQueries({ queryKey: ["benzene-prices", formattedDate] });
        }
    };
}
