"use client";

import { useState, useCallback } from 'react';
import { VoucherRecord, VoucherMatchingRecord, FuelType } from '../types/vouchers.types';

import { vouchersApi } from '../api/vouchers.api';

export function useVouchers(date?: string) {
    const [vouchers, setVouchers] = useState<VoucherRecord[]>([]);
    const [matchingRecords, setMatchingRecords] = useState<VoucherMatchingRecord[]>([]);
    const [matchingTotal, setMatchingTotal] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchVouchers = useCallback(async (currentDate?: string, pumpType?: FuelType) => {
        const targetDate = currentDate || date;
        if (!targetDate) return;

        try {
            setIsLoading(true);
            const data = await vouchersApi.getVouchers(targetDate, pumpType);
            setVouchers(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to fetch vouchers");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [date]);


    const fetchMatching = useCallback(async (currentDate?: string, filters?: { pumpType?: FuelType, side?: string }) => {
        const targetDate = currentDate || date;
        if (!targetDate) return;

        try {
            setIsLoading(true);
            const records = await vouchersApi.getMatchingRecords(targetDate, filters);
            const total = await vouchersApi.getMatchingTotal(targetDate, filters);
            setMatchingRecords(records);
            setMatchingTotal(total);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to fetch matching records");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [date]);


    const addVoucher = async (data: Partial<VoucherRecord>) => {
        try {
            const newVoucher = await vouchersApi.createVoucher(data);
            if (data.date === date) {
                setVouchers(prev => [...prev, newVoucher]);
            }
            return newVoucher;
        } catch (err: any) {
            setError(err.message || "Failed to add voucher");
            throw err;
        }
    };

    const updateVoucher = async (id: string, data: Partial<VoucherRecord>) => {
        try {
            const updated = await vouchersApi.updateVoucher(id, data);
            setVouchers(prev => prev.map(v => v.id === id ? updated : v));
            return updated;
        } catch (err: any) {
            setError(err.message || "Failed to update voucher");
            throw err;
        }
    };

    const removeVoucher = async (id: string) => {
        try {
            await vouchersApi.deleteVoucher(id);
            setVouchers(prev => prev.filter(v => v.id !== id));
        } catch (err: any) {
            setError(err.message || "Failed to delete voucher");
            throw err;
        }
    };

    return {
        vouchers,
        matchingRecords,
        matchingTotal,
        isLoading,
        error,
        fetchVouchers,
        fetchMatching,
        addVoucher,
        updateVoucher,
        removeVoucher
    };
}

