"use client";

import { useState, useEffect, useCallback } from 'react';
import { BalanceMatchingRecord, GaugeRecord } from '../types/supply-book.types';
import { supplyBookApi } from '../api/supply-book.api';

export function useBalanceMatching() {
    const [balanceRecords, setBalanceRecords] = useState<BalanceMatchingRecord[]>([]);
    const [gauges, setGauges] = useState<GaugeRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const [balanceData, gaugeData] = await Promise.all([
            supplyBookApi.getBalanceMatching(),
            supplyBookApi.getGauges()
        ]);
        setBalanceRecords(balanceData);
        setGauges(gaugeData);
        setIsLoading(false);
    }, []);

    const updateGauge = async (id: string, data: Partial<GaugeRecord>) => {
        const updated = await supplyBookApi.updateGauge(id, data);
        setGauges(prev => prev.map(g => g.id === id ? updated : g));
        return updated;
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        balanceRecords,
        gauges,
        isLoading,
        updateGauge,
        refresh: fetchData
    };
}
