import { useQuery } from '@tanstack/react-query';
import { financialHubApi } from '../api/financial-hub.api';

export function useFinancialHub() {
    // Fetch Daily Summary
    const useDailySummary = (date: string, options?: { enabled?: boolean }) => useQuery({
        queryKey: ['financial-summary', date],
        queryFn: () => financialHubApi.getDailySummary(date),
        enabled: options?.enabled !== false && !!date,
    });

    // Fetch Periodic Report
    const usePeriodicReport = (startDate?: string, endDate?: string, options?: { enabled?: boolean }) => useQuery({
        queryKey: ['financial-report', { startDate, endDate }],
        queryFn: () => financialHubApi.getPeriodicReport(startDate, endDate),
        enabled: options?.enabled === true,
    });

    return {
        useDailySummary,
        usePeriodicReport,
    };
}
