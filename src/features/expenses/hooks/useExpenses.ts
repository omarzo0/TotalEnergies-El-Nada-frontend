import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Expense } from '../types/expenses.types';
import { expensesApi } from '../api/expenses.api';

export function useExpenses(selectedDate: string) {
    const queryClient = useQueryClient();
    const formattedDate = selectedDate.includes('T') ? selectedDate.split('T')[0] : selectedDate;

    // Fetch expenses using TanStack Query
    const {
        data: expenses,
        isLoading,
        error
    } = useQuery({
        queryKey: ['expenses', formattedDate],
        queryFn: () => expensesApi.getExpensesByDate(formattedDate),
        enabled: !!formattedDate,
    });

    // Add expense mutation
    const addMutation = useMutation({
        mutationFn: (data: { receiptName: string; money: number }) =>
            expensesApi.addExpense({ date: formattedDate, ...data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', formattedDate] });
            // Expenses affect the shift diary total
            queryClient.invalidateQueries({ queryKey: ['shift-diary', formattedDate] });
        }
    });

    // Update expense mutation
    const updateMutation = useMutation({
        mutationFn: (variables: { id: string, data: { receiptName?: string; money?: number } }) =>
            expensesApi.updateExpense(variables.id, variables.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', formattedDate] });
            queryClient.invalidateQueries({ queryKey: ['shift-diary', formattedDate] });
        }
    });

    // Remove expense mutation
    const removeMutation = useMutation({
        mutationFn: (id: string) => expensesApi.deleteExpense(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', formattedDate] });
            queryClient.invalidateQueries({ queryKey: ['shift-diary', formattedDate] });
        }
    });

    return {
        expenses: expenses ?? [],
        isLoading,
        error: error ? (error as any).message || "Failed to fetch expenses" : null,
        addExpense: addMutation.mutateAsync,
        updateExpense: (id: string, data: { receiptName?: string; money?: number }) => updateMutation.mutateAsync({ id, data }),
        removeExpense: removeMutation.mutateAsync,
        refresh: () => queryClient.invalidateQueries({ queryKey: ['expenses', formattedDate] })
    };
}
