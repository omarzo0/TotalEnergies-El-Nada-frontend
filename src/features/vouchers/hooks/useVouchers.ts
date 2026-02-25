"use client";

import { useState, useEffect, useCallback } from 'react';
import { VoucherRecord, VoucherMatchingRecord, FuelType, VoucherEntity } from '../types/vouchers.types';
import { vouchersApi } from '../api/vouchers.api';

export function useVouchers() {
    const [vouchers, setVouchers] = useState<VoucherRecord[]>([]);
    const [matchingRecords, setMatchingRecords] = useState<VoucherMatchingRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVouchers = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await vouchersApi.getVouchers();
            setVouchers(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch vouchers");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchMatching = useCallback(async (filters?: { fuelType?: FuelType, entity?: VoucherEntity }) => {
        try {
            setIsLoading(true);
            const data = await vouchersApi.getMatchingRecords(filters);
            setMatchingRecords(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch matching records");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addVoucher = async (data: Partial<VoucherRecord>) => {
        try {
            const newVoucher = await vouchersApi.createVoucher(data);
            setVouchers(prev => [...prev, newVoucher]);
            return newVoucher;
        } catch (err) {
            setError("Failed to add voucher");
            throw err;
        }
    };

    const updateVoucher = async (id: string, data: Partial<VoucherRecord>) => {
        try {
            const updated = await vouchersApi.updateVoucher(id, data);
            setVouchers(prev => prev.map(v => v.id === id ? updated : v));
            return updated;
        } catch (err) {
            setError("Failed to update voucher");
            throw err;
        }
    };

    const removeVoucher = async (id: string) => {
        try {
            await vouchersApi.deleteVoucher(id);
            setVouchers(prev => prev.filter(v => v.id !== id));
        } catch (err) {
            setError("Failed to delete voucher");
            throw err;
        }
    };

    return {
        vouchers,
        matchingRecords,
        isLoading,
        error,
        fetchVouchers,
        fetchMatching,
        addVoucher,
        updateVoucher,
        removeVoucher
    };
}
