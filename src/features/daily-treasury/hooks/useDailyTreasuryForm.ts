"use client";

import { useState } from "react";
import { TreasuryManualEntry } from "../types/daily-treasury.types";

export function useDailyTreasuryForm(initialData?: Partial<TreasuryManualEntry>) {
    const [formData, setFormData] = useState({
        statement: initialData?.statement || "",
        money: initialData?.money?.toString() || "",
        price: initialData?.price?.toString() || "",
        quantity: initialData?.quantity?.toString() || "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.statement) newErrors.statement = "Statement is required";
        if (!formData.money || isNaN(Number(formData.money))) newErrors.money = "Valid money amount is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return {
        formData: {
            statement: formData.statement,
            money: Number(formData.money),
            price: Number(formData.price) || 0,
            quantity: Number(formData.quantity) || 0,
        },
        displayData: formData,
        errors,
        handleChange,
        validate,
    };
}
