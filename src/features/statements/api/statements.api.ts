import { Statement } from '../types/statements.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = () => {
    let token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (token) {
        token = token.trim().replace(/^"(.*)"$/, '$1');
    }

    if (!token || token === "null" || token === "undefined") {
        console.warn("FrontEnd (Statements): Token is missing or invalid!");
        return { "Content-Type": "application/json" };
    }

    const finalToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    return {
        "Content-Type": "application/json",
        "Authorization": finalToken
    };
};

export const statementsApi = {
    getStatements: async (): Promise<Statement[]> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/statements`, {
            headers: getHeaders()
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to fetch statements");
        return Array.isArray(result.data) ? result.data : [];
    },

    createStatement: async (name: string): Promise<Statement> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/statements`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ name })
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to create statement");
        return result.data;
    },

    updateStatement: async (oldName: string, newName: string): Promise<Statement> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/statements/${encodeURIComponent(oldName)}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ newName })
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to update statement");
        return result.data;
    },

    deleteStatement: async (name: string): Promise<void> => {
        if (!API_URL) throw new Error("API URL is not defined.");
        const response = await fetch(`${API_URL}/statements/${encodeURIComponent(name)}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to delete statement");
    }
};
