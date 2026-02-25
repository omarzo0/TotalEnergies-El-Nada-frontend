"use client";

import { useState, useEffect, useCallback } from 'react';
import { DeferredClientRecord } from '../types/deferred-clients.types';
import { deferredClientsApi } from '../api/deferred-clients.api';

export function useDeferredClients() {
    const [clients, setClients] = useState<DeferredClientRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClients = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await deferredClientsApi.getClients();
            setClients(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch deferred clients");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addClient = async (data: Partial<DeferredClientRecord>) => {
        try {
            const newClient = await deferredClientsApi.createClient(data);
            setClients(prev => [...prev, newClient]);
            return newClient;
        } catch (err) {
            setError("Failed to add client");
            throw err;
        }
    };

    const updateClient = async (id: string, data: Partial<DeferredClientRecord>) => {
        try {
            const updated = await deferredClientsApi.updateClient(id, data);
            setClients(prev => prev.map(c => c.id === id ? updated : c));
            return updated;
        } catch (err) {
            setError("Failed to update client");
            throw err;
        }
    };

    const removeClient = async (id: string) => {
        try {
            await deferredClientsApi.deleteClient(id);
            setClients(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            setError("Failed to delete client");
            throw err;
        }
    };

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    return {
        clients,
        isLoading,
        error,
        addClient,
        updateClient,
        removeClient,
        refresh: fetchClients
    };
}
