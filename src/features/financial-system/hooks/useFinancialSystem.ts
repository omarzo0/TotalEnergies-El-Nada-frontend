"use client";

import { useState, useEffect, useCallback } from 'react';
import { TrialBalanceEntry, IncomeStatementEntry } from '../types/financial-system.types';
import { financialSystemApi } from '../api/financial-system.api';

export function useFinancialSystem() {
    const [trialBalance, setTrialBalance] = useState<TrialBalanceEntry[]>([]);
    const [incomeStatement, setIncomeStatement] = useState<IncomeStatementEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [tb, is] = await Promise.all([
                financialSystemApi.getTrialBalance(),
                financialSystemApi.getIncomeStatement()
            ]);
            setTrialBalance(tb);
            setIncomeStatement(is);
        } catch (error) {
            console.error("Failed to fetch financial data", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        trialBalance,
        incomeStatement,
        isLoading,
        refresh: fetchData
    };
}
