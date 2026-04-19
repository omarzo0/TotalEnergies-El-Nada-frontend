"use client";

import { useState, useEffect, useCallback } from 'react';
import { Employee, EmployeeFormData } from '../types/employees.types';
import { employeesApi } from '../api/employees.api';

export function useEmployees() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchName, setSearchName] = useState("");

    const fetchEmployees = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await employeesApi.getEmployees();
            setEmployees(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to fetch employees");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    // Client-side filtering
    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchName.toLowerCase())
    );

    const addEmployee = async (data: EmployeeFormData) => {
        try {
            await employeesApi.createEmployee(data);
            await fetchEmployees();
        } catch (err: any) {
            setError(err.message || "Failed to create employee");
            throw err;
        }
    };

    const updateEmployee = async (id: string, data: EmployeeFormData) => {
        try {
            await employeesApi.updateEmployee(id, data);
            await fetchEmployees();
        } catch (err: any) {
            setError(err.message || "Failed to update employee");
            throw err;
        }
    };

    const removeEmployee = async (id: string) => {
        try {
            await employeesApi.deleteEmployee(id);
            await fetchEmployees();
        } catch (err: any) {
            setError(err.message || "Failed to delete employee");
            throw err;
        }
    };

    return {
        employees: filteredEmployees, // Return filtered list
        allEmployees: employees,     // Keep raw list if needed
        isLoading,
        error,
        searchName,
        setSearchName,
        addEmployee,
        updateEmployee,
        removeEmployee,
        refresh: fetchEmployees
    };
}
