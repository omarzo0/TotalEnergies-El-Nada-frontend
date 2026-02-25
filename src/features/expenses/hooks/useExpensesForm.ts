"use client";

import { useState } from 'react';
import { ExpenseRecord, ExpenseFormData } from '../types/expenses.types';

export function useExpensesForm(initialData?: ExpenseRecord) {
    const [formData, setFormData] = useState<ExpenseFormData>({
        amount: initialData?.amount || "",
        receipt: initialData?.receipt || "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ExpenseFormData, string>>>({});

    const handleChange = (field: keyof ExpenseFormData, value: string) => {
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
        const newErrors: Partial<Record<keyof ExpenseFormData, string>> = {};
        if (!formData.amount) newErrors.amount = "Amount is required";
        if (!formData.receipt) newErrors.receipt = "Receipt is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return {
        formData,
        errors,
        handleChange,
        validate,
        reset: () => setFormData({ amount: "", receipt: "" })
    };
}
