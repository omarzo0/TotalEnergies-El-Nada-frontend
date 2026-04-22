import { Employee, EmployeeFormData } from '../types/employees.types';

import { getHeaders } from "@/utils/api.utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const employeesApi = {
    // 1. Get All Employees
    getEmployees: async (): Promise<Employee[]> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/employees`, {
            headers: getHeaders()
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to fetch employees");
        return result.data;
    },

    // 2. Get Employee Names
    getEmployeeNames: async (): Promise<string[]> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/employees/names`, {
            headers: getHeaders()
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to fetch employee names");
        return result.data; // Array of strings
    },

    // 3. Search Employee by Name
    searchEmployees: async (name: string): Promise<Employee[]> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/employees/search?name=${encodeURIComponent(name)}`, {
            headers: getHeaders()
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to search employees");
        return result.data;
    },

    // 4. Create Employee
    createEmployee: async (data: EmployeeFormData): Promise<Employee> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/employees`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to create employee");
        return result.data;
    },

    // 5. Update Employee
    updateEmployee: async (id: string, data: EmployeeFormData): Promise<Employee> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/employees/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Failed to update employee");
        return result.data;
    },

    // 6. Delete Employee
    deleteEmployee: async (id: string): Promise<boolean> => {
        if (!API_URL) throw new Error("API URL is not defined.");

        const response = await fetch(`${API_URL}/employees/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        const result = await response.json();
        return result.success;
    }
};
