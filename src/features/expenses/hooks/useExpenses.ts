"use client";

import { useState, useEffect, useCallback } from 'react';
import { ExpenseRecord } from '../types/expenses.types';
import { expensesApi } from '../api/expenses.api';

export function useExpenses() {
    const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchExpenses = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await expensesApi.getExpenses();
            setExpenses(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch expenses");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addExpense = async (data: ExpenseRecord) => {
        try {
            const newExpense = await expensesApi.createExpense(data);
            setExpenses(prev => [...prev, newExpense]);
            return newExpense;
        } catch (err) {
            setError("Failed to add expense");
            throw err;
        }
    };

    const updateExpense = async (id: string, data: Partial<ExpenseRecord>) => {
        try {
            const updated = await expensesApi.updateExpense(id, data);
            setExpenses(prev => prev.map(e => e.id === id ? updated : e));
            return updated;
        } catch (err) {
            setError("Failed to update expense");
            throw err;
        }
    };

    const removeExpense = async (id: string) => {
        try {
            await expensesApi.deleteExpense(id);
            setExpenses(prev => prev.filter(e => e.id !== id));
        } catch (err) {
            setError("Failed to delete expense");
            throw err;
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    return {
        expenses,
        isLoading,
        error,
        addExpense,
        updateExpense,
        removeExpense,
        refresh: fetchExpenses
    };
}
