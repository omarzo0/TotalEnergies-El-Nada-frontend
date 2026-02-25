"use client";

import { useState, useEffect, useCallback } from 'react';
import { TreasuryTransaction } from '../types/treasury-movement.types';
import { treasuryMovementApi } from '../api/treasury-movement.api';

export function useTreasuryMovement() {
    const [transactions, setTransactions] = useState<TreasuryTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        const data = await treasuryMovementApi.getTransactions();
        setTransactions(data);
        setIsLoading(false);
    }, []);

    const addTransaction = async (data: Partial<TreasuryTransaction>) => {
        const newTransaction = await treasuryMovementApi.createTransaction(data);
        setTransactions(prev => [newTransaction, ...prev]);
        return newTransaction;
    };

    const updateTransaction = async (id: string, data: Partial<TreasuryTransaction>) => {
        const updated = await treasuryMovementApi.updateTransaction(id, data);
        setTransactions(prev => prev.map(t => t.id === id ? updated : t));
        return updated;
    };

    const removeTransaction = async (id: string) => {
        const success = await treasuryMovementApi.deleteTransaction(id);
        if (success) {
            setTransactions(prev => prev.filter(t => t.id !== id));
        }
        return success;
    };

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return {
        transactions,
        isLoading,
        addTransaction,
        updateTransaction,
        removeTransaction,
        refresh: fetchTransactions
    };
}
