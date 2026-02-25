"use client";

import { useState } from 'react';
import { OilRecord, OilFormData } from '../types/oils.types';

export function useOilsForm(initialData?: OilRecord) {
    const [formData, setFormData] = useState<OilFormData>({
        oilType: initialData?.oilType || "",
        incoming: initialData?.incoming || "0",
        startBalance: initialData?.startBalance || "0",
        endBalance: initialData?.endBalance || "0",
        image: initialData?.image || "/images/logo.png"
    });

    const [errors, setErrors] = useState<Partial<Record<keyof OilFormData, string>>>({});

    const handleChange = (field: keyof OilFormData, value: string) => {
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
        const newErrors: Partial<Record<keyof OilFormData, string>> = {};
        if (!formData.oilType) newErrors.oilType = "Oil Type is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return {
        formData,
        errors,
        handleChange,
        validate,
        reset: () => setFormData({
            oilType: "",
            incoming: "0",
            startBalance: "0",
            endBalance: "0",
            image: "/images/logo.png"
        })
    };
}
