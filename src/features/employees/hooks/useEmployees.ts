"use client";

import { useState, useEffect } from 'react';
import { Employee } from '../types/employees.types';
import { employeesApi } from '../api/employees.api';

export function useEmployees() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEmployees = async () => {
        try {
            setIsLoading(true);
            const data = await employeesApi.getEmployees();
            setEmployees(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch employees");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const addEmployee = async (data: Partial<Employee>) => {
        try {
            const newEmployee = await employeesApi.createEmployee(data);
            setEmployees(prev => [...prev, newEmployee]);
            return newEmployee;
        } catch (err) {
            setError("Failed to add employee");
            throw err;
        }
    };

    const updateEmployee = async (id: string, data: Partial<Employee>) => {
        try {
            const updated = await employeesApi.updateEmployee(id, data);
            setEmployees(prev => prev.map(emp => emp.id === id ? updated : emp));
            return updated;
        } catch (err) {
            setError("Failed to update employee");
            throw err;
        }
    };

    const removeEmployee = async (id: string) => {
        try {
            await employeesApi.deleteEmployee(id);
            setEmployees(prev => prev.filter(emp => emp.id !== id));
        } catch (err) {
            setError("Failed to delete employee");
            throw err;
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    return {
        employees,
        isLoading,
        error,
        addEmployee,
        updateEmployee,
        removeEmployee,
        refresh: fetchEmployees
    };
}
