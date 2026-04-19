"use client";

import { useState } from 'react';
import { DeferredClientPayment, DeferredClientFormData } from '../types/deferred-clients.types';

export function useDeferredClientsForm(initialData?: DeferredClientPayment) {
    const [formData, setFormData] = useState<DeferredClientFormData>({
        clientName: initialData?.clientName || '',
        receiptName: initialData?.receiptName || (initialData as any)?.sand || '',
        money: initialData?.money || 0,
        amount: initialData?.amount || 0,
        receiptNumber: initialData?.receiptNumber || '',
        date: initialData?.date || new Date().toISOString().split("T")[0]
    });

    const [errors, setErrors] = useState<Partial<Record<keyof DeferredClientFormData, string>>>({});

    const handleChange = (field: keyof DeferredClientFormData, value: any) => {
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
        const newErrors: Partial<Record<keyof DeferredClientFormData, string>> = {};
        if (!formData.clientName) newErrors.clientName = "Client name is required";
        if (!formData.receiptName) newErrors.receiptName = "Receipt name is required";
        if (formData.money === undefined || formData.money < 0) newErrors.money = "Valid money is required";
        if (formData.amount === undefined || formData.amount < 0) newErrors.amount = "Valid amount is required";
        if (!formData.receiptNumber) newErrors.receiptNumber = "Receipt number is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return {
        formData,
        errors,
        handleChange,
        validate,
        reset: () => setFormData({
            clientName: '',
            receiptName: '',
            money: 0,
            amount: 0,
            receiptNumber: '',
            date: new Date().toISOString().split("T")[0]
        })
    };
}
