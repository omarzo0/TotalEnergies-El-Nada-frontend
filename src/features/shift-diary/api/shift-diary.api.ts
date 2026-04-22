import { ShiftDiarySummary, StatementSummary, BenzeneReading, ExpenseReading, SupplyBookEntry } from '../types/shift-diary.types';

import { getHeaders } from "@/utils/api.utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Map backend statement group to frontend StatementSummary
const mapStatementGroup = (group: any, originalType?: string): StatementSummary => ({
    statement: group.statement ?? '',
    entries: (group.entries ?? []).map((e: any) => ({
        receiptName: e.receiptName ?? '',
        money: e.money ?? 0
    })),
    total: group.total ?? 0,
    transfer: group.transfer ?? 0,
    priceDiff: group.priceDiff ?? 0,
    originalType,
});


// Map backend benzene reading to frontend BenzeneReading
const mapBenzeneReading = (b: any): BenzeneReading => ({
    trumbaNumber: b.pumpNumber ?? b.trumbaNumber ?? 0,
    trumbaType: b.pumpType ?? b.trumbaType ?? '',
    start: b.start ?? 0,
    end: b.end ?? 0,
    total: b.total ?? b.liters ?? 0,
});

// Map backend expense to frontend ExpenseReading
const mapExpenseReading = (e: any): ExpenseReading => ({
    receiptName: e.receiptName ?? '',
    money: e.money ?? 0,
});

// Map backend supply book entry to frontend SupplyBookEntry
const mapSupplyBookEntry = (s: any): SupplyBookEntry => ({
    benzType: s.benzType ?? '',
    start: s.start ?? 0,
    incoming: s.incoming ?? 0,
    dispensed: s.dispensed ?? 0,
    pumps: s.pumps ?? '',
    end: s.end ?? 0,
    standard: s.standard ?? 0,
});

// Map the full backend response to our ShiftDiarySummary
const mapApiResponse = (raw: any): ShiftDiarySummary => {
    const rawReceipts = (raw.receipts ?? raw.mkbodat ?? []).map((g: any) => mapStatementGroup(g, 'مقبوضات'));
    const rawPayments = (raw.payments ?? raw.mdfo3at ?? []).map((g: any) => mapStatementGroup(g, 'مدفوعات'));

    // Extract accounts (groups starting with "ح/")
    const mkbodat = rawReceipts.filter(g => !g.statement.startsWith('ح/'));
    const mdfo3at = rawPayments.filter(g => !g.statement.startsWith('ح/'));
    const accounts = [
        ...rawReceipts.filter(g => g.statement.startsWith('ح/')),
        ...rawPayments.filter(g => g.statement.startsWith('ح/'))
    ];

    return {
        number: String(raw.number ?? ''),
        date: raw.date ?? '',
        mkbodat,
        mdfo3at,
        accounts,
        benzene: (raw.benzene ?? []).map(mapBenzeneReading),
        expenses: (raw.expenses ?? []).map(mapExpenseReading),
        supplyBook: (raw.supplyBook ?? []).map(mapSupplyBookEntry),
    };
};

export const shiftDiaryApi = {
    getByDate: async (date: string): Promise<ShiftDiarySummary | null> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/shift-diary/${date}`, {
            headers: getHeaders()
        });

        const result = await response.json();

        if (!result.success) {
            if (result.message && (result.message.includes("بيانات") || result.message.includes("data"))) {
                console.warn(`shiftDiaryApi: No data found for ${date}`);
                return null;
            }
            throw new Error(result.message);
        }

        // Handle case where data is wrapped in an array
        const raw = Array.isArray(result.data) ? result.data[0] : result.data;
        if (!raw) return null;

        return mapApiResponse(raw);
    },

    updateNa2lFr2: async (data: { date: string, type: string, statement: string, transfer: number, priceDiff: number }): Promise<any> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        // Map frontend field names back to backend field names
        const body = {
            date: data.date,
            type: data.type,
            statement: data.statement,
            transfer: data.transfer,
            priceDiff: data.priceDiff,
        };


        const response = await fetch(`${API_URL}/shift-diary/entry-adjustment`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(body)
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        return result.data;
    }
};
