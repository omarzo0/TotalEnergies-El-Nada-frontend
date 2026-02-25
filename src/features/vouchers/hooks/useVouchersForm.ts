"use client";

import { useState } from 'react';
import { VoucherRecord, VoucherFormData } from '../types/vouchers.types';

export function useVouchersForm(initialData?: VoucherRecord) {
    const [formData, setFormData] = useState<VoucherFormData>({
        entity: initialData?.entity || 'police',
        serial: initialData?.serial || '',
        total: initialData?.total || '',
        category: initialData?.category || '',
        price: initialData?.price || '',
        fuelType: initialData?.fuelType || 'gasoline92',
        image: initialData?.image || '/images/logo.png',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof VoucherFormData, string>>>({});

    const handleChange = (field: keyof VoucherFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value as any }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors: Partial<Record<keyof VoucherFormData, string>> = {};
        if (!formData.serial) newErrors.serial = "Serial is required";
        if (!formData.total) newErrors.total = "Total is required";
        if (!formData.category) newErrors.category = "Category is required";
        if (!formData.price) newErrors.price = "Price is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return {
        formData,
        errors,
        handleChange,
        validate,
        reset: () => setFormData({
            entity: 'police',
            serial: '',
            total: '',
            category: '',
            price: '',
            fuelType: 'gasoline92',
            image: '/images/logo.png',
        })
    };
}
