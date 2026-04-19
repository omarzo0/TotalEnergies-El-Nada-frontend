import { ShiftDiarySummary, StatementSummary, BenzeneReading } from '../types/shift-diary.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = () => {
    let token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

    if (token) {
        token = token.trim().replace(/^"(.*)"$/, '$1');
    }

    if (!token || token === "null" || token === "undefined") {
        console.warn("FrontEnd (ShiftDiary): Token is missing or invalid!");
        return { "Content-Type": "application/json" };
    }

    const finalToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    return {
        "Content-Type": "application/json",
        "Authorization": finalToken
    };
};

// Map backend statement group to frontend StatementSummary
const mapStatementGroup = (group: any): StatementSummary => ({
    statement: group.statement ?? '',
    entries: (group.entries ?? []).map((e: any) => ({
        sand: e.receiptName ?? e.sand ?? '',
        money: e.money ?? 0
    })),
    total: group.total ?? 0,
    na2l: group.transfer ?? group.na2l ?? 0,
    fr2s3r: group.priceDiff ?? group.fr2s3r ?? 0,
});

// Map backend benzene reading to frontend BenzeneReading
const mapBenzeneReading = (b: any): BenzeneReading => ({
    trumbaNumber: b.pumpNumber ?? b.trumbaNumber ?? 0,
    trumbaType: b.pumpType ?? b.trumbaType ?? '',
    start: b.start ?? 0,
    end: b.end ?? 0,
    total: b.total ?? 0,
});

// Map the full backend response to our ShiftDiarySummary
const mapApiResponse = (raw: any): ShiftDiarySummary => ({
    number: String(raw.number ?? ''),
    date: raw.date ?? '',
    mkbodat: (raw.receipts ?? raw.mkbodat ?? []).map(mapStatementGroup),
    mdfo3at: (raw.payments ?? raw.mdfo3at ?? []).map(mapStatementGroup),
    benzene: (raw.benzene ?? []).map(mapBenzeneReading),
});

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

    updateNa2lFr2: async (data: { date: string, type: string, statement: string, na2l: number, fr2s3r: number }): Promise<any> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        // Map frontend field names back to backend field names
        const body = {
            date: data.date,
            type: data.type,
            statement: data.statement,
            transfer: data.na2l,
            priceDiff: data.fr2s3r,
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
