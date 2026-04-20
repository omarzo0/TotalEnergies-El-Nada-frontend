"use client";

import { useState } from 'react';
import { VoucherRecord, VoucherFormData } from '../types/vouchers.types';

export function useVouchersForm(initialData?: VoucherRecord) {
    const [formData, setFormData] = useState<VoucherFormData>({
        date: initialData?.date || new Date().toISOString().split("T")[0],
        side: initialData?.side || 'police',
        voucherSerial: initialData?.voucherSerial || '',
        total: initialData?.total,
        liters: initialData?.liters || 0,
        price: initialData?.price,
        pumpType: initialData?.pumpType || 'ben92',

    });


    const [errors, setErrors] = useState<Partial<Record<keyof VoucherFormData, string>>>({});

    const handleChange = (field: keyof VoucherFormData, value: any) => {
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
        const newErrors: Partial<Record<keyof VoucherFormData, string>> = {};
        if (!formData.voucherSerial) newErrors.voucherSerial = "Serial is required";
        if (!formData.liters) newErrors.liters = "Quantity is required";
        if (!formData.date) newErrors.date = "Date is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    return {
        formData,
        errors,
        handleChange,
        validate,
        reset: () => setFormData({
            date: new Date().toISOString().split("T")[0],
            side: 'police',
            voucherSerial: '',
            total: undefined,
            liters: 0,
            price: undefined,
            pumpType: 'ben92',

        })

    };
}


