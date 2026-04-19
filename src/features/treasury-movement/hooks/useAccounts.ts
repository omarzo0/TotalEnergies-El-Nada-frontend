"use client";

import { useState, useEffect, useCallback } from 'react';
import { Account, AccountFormData, AccountSearchFilters } from '../types/treasury-movement.types';
import { accountsApi } from '../api/accounts.api';

export function useAccounts(initialFilters: AccountSearchFilters) {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<AccountSearchFilters>(initialFilters);

    const fetchAccounts = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await accountsApi.getAccounts(filters);
            setAccounts(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to fetch accounts");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    const addAccount = async (data: AccountFormData) => {
        try {
            await accountsApi.createAccount(data);
            await fetchAccounts();
        } catch (err: any) {
            setError(err.message || "Failed to create account entry");
            throw err;
        }
    };

    const updateAccount = async (id: string, data: AccountFormData) => {
        try {
            await accountsApi.updateAccount(id, data);
            await fetchAccounts();
        } catch (err: any) {
            setError(err.message || "Failed to update account entry");
            throw err;
        }
    };

    const removeAccount = async (id: string) => {
        try {
            await accountsApi.deleteAccount(id);
            await fetchAccounts();
        } catch (err: any) {
            setError(err.message || "Failed to delete account entry");
            throw err;
        }
    };

    return {
        accounts,
        isLoading,
        error,
        filters,
        setFilters,
        addAccount,
        updateAccount,
        removeAccount,
        refresh: fetchAccounts
    };
}
