"use client";

import { useState } from 'react';
import { DeferredClientRecord, DeferredClientFormData } from '../types/deferred-clients.types';

export function useDeferredClientsForm(initialData?: DeferredClientRecord) {
    const [formData, setFormData] = useState<DeferredClientFormData>({
        client: initialData?.client || '',
        receipt: initialData?.receipt || '',
        amount: initialData?.amount || '',
        image: initialData?.image || '/images/logo.png',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof DeferredClientFormData, string>>>({});

    const handleChange = (field: keyof DeferredClientFormData, value: string) => {
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
        if (!formData.client) newErrors.client = "Client is required";
        if (!formData.receipt) newErrors.receipt = "Receipt is required";
        if (!formData.amount) newErrors.amount = "Amount is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return {
        formData,
        errors,
        handleChange,
        validate,
        reset: () => setFormData({
            client: '',
            receipt: '',
            amount: '',
            image: '/images/logo.png',
        })
    };
}
