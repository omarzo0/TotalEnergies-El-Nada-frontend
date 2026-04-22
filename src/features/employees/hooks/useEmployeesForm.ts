"use client";

import { useState } from 'react';
import { Employee, EmployeeFormData } from '../types/employees.types';

export function useEmployeesForm(initialData?: Employee) {
    const [formData, setFormData] = useState<EmployeeFormData>({
        name: initialData?.name || "",
        nationalId: initialData?.nationalId || 0,
        mobileNum: initialData?.mobileNum || 0,
        job: initialData?.job || "",
        salary: initialData?.salary || 0
    });

    const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({});

    const handleChange = (field: keyof EmployeeFormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors: Partial<Record<keyof EmployeeFormData, string>> = {};
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.nationalId) newErrors.nationalId = "National ID is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return {
        formData,
        errors,
        handleChange,
        validate,
        reset: () => setFormData({
            name: "",
            nationalId: 0,
            mobileNum: 0,
            job: "",
            salary: 0
        })
    };
}
