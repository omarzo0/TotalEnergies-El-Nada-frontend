import { getHeaders } from "@/utils/api.utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface TicketResponse {
    user: string;
    userType: 'station' | 'platform';
    message: string;
    createdAt: string;
}

export interface SupportTicket {
    _id: string;
    subject: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    status: 'open' | 'closed' | 'in_progress';
    responses: TicketResponse[];
    createdAt: string;
    updatedAt: string;
}

export interface SupportWarning {
    _id: string;
    title: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    isGlobal: boolean;
    targetRoles?: string[];
    responses: TicketResponse[];
    createdAt: string;
}

export const supportApi = {
    // --- Tickets ---
    getTickets: async (): Promise<SupportTicket[]> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/support/tickets`, {
            headers: getHeaders()
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to fetch tickets");
        return Array.isArray(result.data) ? result.data : [];
    },

    createTicket: async (data: Partial<SupportTicket>): Promise<SupportTicket> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/support/tickets`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to create ticket");
        return result.data;
    },

    addTicketResponse: async (id: string, message: string): Promise<SupportTicket> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/support/tickets/${id}/responses`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ message })
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to add response");
        return result.data;
    },

    deleteTicket: async (id: string): Promise<boolean> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/support/tickets/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        const result = await response.json();
        return result.success;
    },

    // --- Warnings ---
    getWarnings: async (): Promise<SupportWarning[]> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/support/warnings`, {
            headers: getHeaders()
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to fetch warnings");
        return Array.isArray(result.data) ? result.data : [];
    },

    addWarningResponse: async (id: string, message: string): Promise<SupportWarning> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/support/warnings/${id}/responses`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ message })
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to respond to warning");
        return result.data;
    }
};
