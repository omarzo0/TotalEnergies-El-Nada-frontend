"use client";

import { useState } from 'react';
import { Expense, ExpenseFormData } from '../types/expenses.types';

export function useExpensesForm(initialData?: Expense) {
    const [formData, setFormData] = useState<ExpenseFormData>({
        money: initialData?.money || 0,
        receiptName: initialData?.receiptName || "",
        date: initialData?.date || new Date().toISOString().split("T")[0]
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ExpenseFormData, string>>>({});

    const handleChange = (field: keyof ExpenseFormData, value: any) => {
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
        if (!formData.money || formData.money <= 0) newErrors.money = "Valid amount is required";
        if (!formData.receiptName) newErrors.receiptName = "Receipt name is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return {
        formData,
        errors,
        handleChange,
        validate,
        reset: () => setFormData({ money: 0, receiptName: "", date: "" })
    };
}
