"use client";

import { useState, useEffect, useCallback } from 'react';
import { DeferredClientPayment } from '../types/deferred-clients.types';
import { deferredClientsApi } from '../api/deferred-clients.api';

export function useDeferredClients(selectedDate: string) {
    const [payments, setPayments] = useState<DeferredClientPayment[]>([]);
    const [dailyTotal, setDailyTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPayments = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await deferredClientsApi.getPaymentsByDate(selectedDate);
            setPayments(response.data);
            setDailyTotal(response.total);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to fetch deferred clients");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDate]);

    const addPayment = async (data: Partial<DeferredClientPayment>) => {
        try {
            const newPayment = await deferredClientsApi.addPayment({ date: selectedDate, ...data });
            await fetchPayments();
            return newPayment;
        } catch (err: any) {
            setError(err.message || "Failed to add payment");
            throw err;
        }
    };

    const updatePayment = async (id: string, data: Partial<DeferredClientPayment>) => {
        try {
            const updated = await deferredClientsApi.updatePayment(id, data);
            await fetchPayments();
            return updated;
        } catch (err: any) {
            setError(err.message || "Failed to update payment");
            throw err;
        }
    };

    const removePayment = async (id: string) => {
        try {
            await deferredClientsApi.deletePayment(id);
            await fetchPayments();
        } catch (err: any) {
            setError(err.message || "Failed to delete payment");
            throw err;
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    return {
        payments,
        dailyTotal,
        isLoading,
        error,
        addPayment,
        updatePayment,
        removePayment,
        refresh: fetchPayments
    };
}
