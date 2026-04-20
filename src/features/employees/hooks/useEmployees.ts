import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Employee, EmployeeFormData } from '../types/employees.types';
import { employeesApi } from '../api/employees.api';

export function useEmployees() {
    const queryClient = useQueryClient();
    const [searchName, setSearchName] = useState("");

    // Fetch Employees using Query
    const {
        data: employees,
        isLoading,
        error
    } = useQuery({
        queryKey: ['employees'],
        queryFn: employeesApi.getEmployees,
    });

    // Client-side filtering logic memoized
    const filteredEmployees = useMemo(() => {
        if (!employees) return [];
        return employees.filter(emp =>
            emp.name.toLowerCase().includes(searchName.toLowerCase())
        );
    }, [employees, searchName]);

    // Mutations
    const addMutation = useMutation({
        mutationFn: (data: EmployeeFormData) => employeesApi.createEmployee(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: (variables: { id: string, data: EmployeeFormData }) =>
            employeesApi.updateEmployee(variables.id, variables.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        }
    });

    const removeMutation = useMutation({
        mutationFn: (id: string) => employeesApi.deleteEmployee(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        }
    });

    return {
        employees: filteredEmployees,
        allEmployees: employees ?? [],
        isLoading,
        error: error ? (error as any).message || "Failed to fetch employees" : null,
        searchName,
        setSearchName,
        addEmployee: addMutation.mutateAsync,
        updateEmployee: (id: string, data: EmployeeFormData) => updateMutation.mutateAsync({ id, data }),
        removeEmployee: removeMutation.mutateAsync,
        refresh: () => queryClient.invalidateQueries({ queryKey: ['employees'] })
    };
}
