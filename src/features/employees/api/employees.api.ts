import { Employee } from '../types/employees.types';

export const employeesApi = {
    getEmployees: async (): Promise<Employee[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
            { id: "1", name: "محمد أحمد", nationalId: "29001011234567", phone: "01012345678", position: "مدير", salary: "15000" },
            { id: "2", name: "محمود علي", nationalId: "28502022345678", phone: "01123456789", position: "كاشير", salary: "8000" },
            { id: "3", name: "سيد حسن", nationalId: "29203033456789", phone: "01234567890", position: "عامل صيانة", salary: "6000" },
        ];
    },

    createEmployee: async (data: Partial<Employee>): Promise<Employee> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            id: Math.random().toString(36).substr(2, 9),
            name: data.name || "",
            nationalId: data.nationalId || "",
            phone: data.phone || "",
            position: data.position || "",
            salary: data.salary || "0",
        };
    },

    updateEmployee: async (id: string, data: Partial<Employee>): Promise<Employee> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            id,
            name: "",
            nationalId: "",
            phone: "",
            position: "",
            salary: "0",
            ...data
        };
    },

    deleteEmployee: async (id: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    }
};
