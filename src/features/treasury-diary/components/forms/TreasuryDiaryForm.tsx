"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/ui/Input";
import { TreasuryRecord } from "../../types/treasury-diary.types";
import { useTreasuryDiaryForm } from "../../hooks/useTreasuryDiaryForm";

interface TreasuryDiaryFormProps {
    initialData?: TreasuryRecord;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export default function TreasuryDiaryForm({ initialData, onSubmit, onCancel, isEditing }: TreasuryDiaryFormProps) {
    const t = useTranslations("table.treasuryDiary");
    const tLabels = useTranslations("labels");
    const tButtons = useTranslations("buttons");

    const { formData, errors, handleChange, validate } = useTreasuryDiaryForm(initialData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    label={t("description")}
                    value={formData.labelKey}
                    onChange={(e) => handleChange("labelKey", e.target.value)}
                    error={errors.labelKey}
                    placeholder="e.g. Gasoline 80"
                />
                <Input
                    label={t("amount")}
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    error={errors.amount}
                    placeholder="0.00"
                />
                <Input
                    label={t("price")}
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="0.00"
                />
                <Input
                    label={t("quantity")}
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleChange("quantity", e.target.value)}
                    placeholder="0"
                />
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn-secondary"
                >
                    {tButtons("cancel")}
                </button>
                <button
                    type="submit"
                    className="btn-primary"
                >
                    {isEditing ? tButtons("save") : tButtons("confirm")}
                </button>
            </div>
        </form>
    );
}
