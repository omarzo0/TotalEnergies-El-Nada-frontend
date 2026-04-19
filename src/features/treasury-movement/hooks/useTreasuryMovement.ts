"use client";

import { useState, useEffect, useCallback } from 'react';
import { TreasuryMovement, TreasuryMovementFormData, TreasuryMovementSearchFilters } from '../types/treasury-movement.types';
import { treasuryMovementApi } from '../api/treasury-movement.api';

export function useTreasuryMovement(initialFilters: TreasuryMovementSearchFilters) {
    const [movements, setMovements] = useState<TreasuryMovement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<TreasuryMovementSearchFilters>(initialFilters);

    const fetchMovements = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await treasuryMovementApi.getMovements(filters);
            setMovements(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to fetch movements");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchMovements();
    }, [fetchMovements]);

    const addMovement = async (data: TreasuryMovementFormData) => {
        try {
            await treasuryMovementApi.createMovement(data);
            await fetchMovements();
        } catch (err: any) {
            setError(err.message || "Failed to create movement");
            throw err;
        }
    };

    const updateMovement = async (id: string, data: TreasuryMovementFormData) => {
        try {
            await treasuryMovementApi.updateMovement(id, data);
            await fetchMovements();
        } catch (err: any) {
            setError(err.message || "Failed to update movement");
            throw err;
        }
    };

    const removeMovement = async (id: string) => {
        try {
            await treasuryMovementApi.deleteMovement(id);
            await fetchMovements();
        } catch (err: any) {
            setError(err.message || "Failed to delete movement");
            throw err;
        }
    };

    return {
        movements,
        isLoading,
        error,
        filters,
        setFilters,
        addMovement,
        updateMovement,
        removeMovement,
        refresh: fetchMovements
    };
}
