"use client";

import { useState, useEffect } from 'react';
import { ShiftRecord, ShiftFormData } from '../types/shift-diary.types';

export function useShiftDiaryForm(initialData?: ShiftRecord) {
    const [formData, setFormData] = useState<ShiftFormData>({
        pump: initialData?.pump || "",
        type: initialData?.type || "بنزين 92",
        start: initialData?.start || "0",
        end: initialData?.end || "0",
        priceDiff: initialData?.priceDiff || "0",
        transfer: initialData?.transfer || "0",
        description: initialData?.description || "",
        creditor: initialData?.creditor || "0",
        debtor: initialData?.debtor || "0"
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ShiftFormData, string>>>({});

    const handleChange = (field: keyof ShiftFormData, value: string) => {
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
        const newErrors: Partial<Record<keyof ShiftFormData, string>> = {};
        if (!formData.pump) newErrors.pump = "Pump Number is required";
        if (parseFloat(formData.end) < parseFloat(formData.start)) {
            newErrors.end = "End value cannot be less than start value";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return {
        formData,
        errors,
        handleChange,
        validate,
        reset: () => setFormData({
            pump: "",
            type: "بنزين 92",
            start: "0",
            end: "0",
            priceDiff: "0",
            transfer: "0",
            description: "",
            creditor: "0",
            debtor: "0"
        })
    };
}
