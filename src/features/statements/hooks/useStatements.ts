import { useState, useCallback, useEffect } from 'react';
import { Statement } from '../types/statements.types';
import { statementsApi } from '../api/statements.api';

export const useStatements = () => {
    const [statements, setStatements] = useState<Statement[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStatements = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await statementsApi.getStatements();
            setStatements(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch statements');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addStatement = async (name: string) => {
        setIsLoading(true);
        try {
            await statementsApi.createStatement(name);
            await fetchStatements();
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to create statement');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatement = async (oldName: string, newName: string) => {
        setIsLoading(true);
        try {
            await statementsApi.updateStatement(oldName, newName);
            await fetchStatements();
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to update statement');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const removeStatement = async (name: string) => {
        setIsLoading(true);
        try {
            await statementsApi.deleteStatement(name);
            await fetchStatements();
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to delete statement');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStatements();
    }, [fetchStatements]);

    return {
        statements,
        isLoading,
        error,
        addStatement,
        updateStatement,
        removeStatement,
        refresh: fetchStatements
    };
};
