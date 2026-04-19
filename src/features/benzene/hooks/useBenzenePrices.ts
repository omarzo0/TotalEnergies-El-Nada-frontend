"use client";

import { useState, useEffect, useCallback } from "react";
import { BenzenePrices } from "../types/benzene.types";
import { benzeneApi } from "../api/benzene.api";

export function useBenzenePrices(selectedDate: string) {
    const [prices, setPrices] = useState<BenzenePrices | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchPrices = useCallback(async () => {
        // Ensure date is YYYY-MM-DD
        const formattedDate = selectedDate.includes('T') ? selectedDate.split('T')[0] : selectedDate;

        setIsLoading(true);
        setError(null);
        try {
            const data = await benzeneApi.getPrices(formattedDate);
            setPrices(data);
        } catch (err: any) {
            console.error(`useBenzenePrices: Error fetching prices for ${formattedDate}:`, err);
            setError(err.message || "Failed to fetch prices");
            setPrices(null);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        fetchPrices();
    }, [fetchPrices]);

    const savePrices = async (data: BenzenePrices) => {
        const formattedDate = selectedDate.includes('T') ? selectedDate.split('T')[0] : selectedDate;
        setIsSaving(true);
        setError(null);
        try {
            const updated = await benzeneApi.updatePrices(formattedDate, data);
            setPrices(updated);
            return true;
        } catch (err: any) {
            setError(err.message || "Failed to save prices");
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const deletePrices = async () => {
        const formattedDate = selectedDate.includes('T') ? selectedDate.split('T')[0] : selectedDate;
        setIsSaving(true);
        setError(null);
        try {
            await benzeneApi.deletePrices(formattedDate);
            setPrices(null);
            return true;
        } catch (err: any) {
            setError(err.message || "Failed to delete prices");
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    return {
        prices,
        isLoading,
        isSaving,
        error,
        savePrices,
        deletePrices,
        refetch: fetchPrices
    };
}
