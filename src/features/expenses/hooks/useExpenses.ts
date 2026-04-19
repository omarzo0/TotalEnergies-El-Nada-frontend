"use client";

import { useState, useEffect, useCallback } from 'react';
import { Expense } from '../types/expenses.types';
import { expensesApi } from '../api/expenses.api';

export function useExpenses(selectedDate: string) {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchExpenses = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await expensesApi.getExpensesByDate(selectedDate);
            setExpenses(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to fetch expenses");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDate]);

    const addExpense = async (data: { sand: string; money: number }) => {
        try {
            const newExpense = await expensesApi.addExpense({ date: selectedDate, ...data });
            await fetchExpenses();
            return newExpense;
        } catch (err: any) {
            setError(err.message || "Failed to add expense");
            throw err;
        }
    };

    const updateExpense = async (id: string, data: { sand?: string; money?: number }) => {
        try {
            const updated = await expensesApi.updateExpense(id, data);
            await fetchExpenses();
            return updated;
        } catch (err: any) {
            setError(err.message || "Failed to update expense");
            throw err;
        }
    };

    const removeExpense = async (id: string) => {
        try {
            await expensesApi.deleteExpense(id);
            await fetchExpenses();
        } catch (err: any) {
            setError(err.message || "Failed to delete expense");
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
