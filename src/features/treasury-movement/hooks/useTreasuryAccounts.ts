"use client";

import { useState, useEffect, useCallback } from 'react';
import { TreasuryAccount } from '../types/treasury-movement.types';
import { treasuryMovementApi } from '../api/treasury-movement.api';

export function useTreasuryAccounts() {
    const [accounts, setAccounts] = useState<TreasuryAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAccounts = useCallback(async () => {
        setIsLoading(true);
        const data = await treasuryMovementApi.getAccounts();
        setAccounts(data);
        setIsLoading(false);
    }, []);

    const addAccount = async (data: Partial<TreasuryAccount>) => {
        const newAccount = await treasuryMovementApi.createAccount(data);
        setAccounts(prev => [newAccount, ...prev]);
        return newAccount;
    };

    const updateAccount = async (id: string, data: Partial<TreasuryAccount>) => {
        const updated = await treasuryMovementApi.updateAccount(id, data);
        setAccounts(prev => prev.map(a => a.id === id ? updated : a));
        return updated;
    };

    const removeAccount = async (id: string) => {
        const success = await treasuryMovementApi.deleteAccount(id);
        if (success) {
            setAccounts(prev => prev.filter(a => a.id !== id));
        }
        return success;
    };

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    return {
        accounts,
        isLoading,
        addAccount,
        updateAccount,
        removeAccount,
        refresh: fetchAccounts
    };
}
