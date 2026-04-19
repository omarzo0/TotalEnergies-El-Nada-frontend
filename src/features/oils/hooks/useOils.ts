"use client";

import { useState, useEffect, useCallback } from 'react';
import { Oil } from '../types/oils.types';
import { oilsApi } from '../api/oils.api';

export function useOils() {
    const [oils, setOils] = useState<Oil[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOils = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await oilsApi.getAllOils();
            setOils(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to fetch oils");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addOil = async (data: { oilName: string; price: number; date: string }) => {
        try {
            const newOil = await oilsApi.addOil(data);
            await fetchOils();
            return newOil;
        } catch (err: any) {
            setError(err.message || "Failed to add oil");
            throw err;
        }
    };

    useEffect(() => {
        fetchOils();
    }, [fetchOils]);

    return {
        oils,
        isLoading,
        error,
        addOil,
        refresh: fetchOils
    };
}
