"use client";

import { useState } from 'react';
import { TreasuryRecord, TreasuryDiaryFormData } from '../types/treasury-diary.types';

export function useTreasuryDiaryForm(initialData?: TreasuryRecord) {
    const [formData, setFormData] = useState<TreasuryDiaryFormData>({
        amount: initialData?.amount || '',
        price: initialData?.price || '',
        quantity: initialData?.quantity || '',
        labelKey: initialData?.labelKey || '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof TreasuryDiaryFormData, string>>>({});

    const handleChange = (field: keyof TreasuryDiaryFormData, value: string) => {
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
        const newErrors: Partial<Record<keyof TreasuryDiaryFormData, string>> = {};
        if (!formData.amount) newErrors.amount = "Amount is required";
        if (!formData.labelKey) newErrors.labelKey = "Description is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return {
        formData,
        errors,
        handleChange,
        validate,
        reset: () => setFormData({
            amount: '',
            price: '',
            quantity: '',
            labelKey: '',
        })
    };
}
