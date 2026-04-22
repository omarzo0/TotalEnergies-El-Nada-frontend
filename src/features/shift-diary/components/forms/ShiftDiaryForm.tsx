"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Input, Select } from "@/ui/Input";
import { ShiftRecord } from "../../types/shift-diary.types";
import { useShiftDiaryForm } from "../../hooks/useShiftDiaryForm";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";

interface ShiftDiaryFormProps {
    initialData?: ShiftRecord;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export default function ShiftDiaryForm({ initialData, onSubmit, onCancel, isEditing }: ShiftDiaryFormProps) {
    const t = useTranslations("table.shiftDiary");
    const tButtons = useTranslations("buttons");
    const { formData, errors, handleChange, validate } = useShiftDiaryForm(initialData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    const fuelTypes = [
        { value: "بنزين 92", label: "بنزين 92" },
        { value: "بنزين 95", label: "بنزين 95" },
        { value: "سولار", label: "سولار" }
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label={t("pumpNumber")}
                    value={formData.pump}
                    onChange={(e) => handleChange("pump", e.target.value)}
                    error={errors.pump}
                    type="text"
                    placeholder="e.g. 1"
                    disabled={isEditing}
                />
                <Select
                    label={t("type")}
                    value={formData.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    options={fuelTypes}
                />
                <Input
                    label={t("start")}
                    value={formData.start}
                    onChange={(e) => handleChange("start", e.target.value)}
                    error={errors.start}
                    type="number"
                />
                <Input
                    label={t("end")}
                    value={formData.end}
                    onChange={(e) => handleChange("end", e.target.value)}
                    error={errors.end}
                    type="number"
                />
                <Input
                    label={t("priceDiff")}
                    value={formData.priceDiff}
                    onChange={(e) => handleChange("priceDiff", e.target.value)}
                    type="number"
                />
                <Input
                    label={t("transfer")}
                    value={formData.transfer}
                    onChange={(e) => handleChange("transfer", e.target.value)}
                    type="number"
                />
                <Input
                    label={t("creditor")}
                    value={formData.creditor}
                    onChange={(e) => handleChange("creditor", e.target.value)}
                    type="number"
                />
                <Input
                    label={t("debtor")}
                    value={formData.debtor}
                    onChange={(e) => handleChange("debtor", e.target.value)}
                    type="number"
                />
                <div className="md:col-span-2">
                    <Input
                        label={t("description")}
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        type="text"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn-secondary"
                >
                    {tButtons("cancel")}
                </button>
                <PermissionGuard resource="shiftDiary" action={isEditing ? 'update' : 'create'}>
                    <button
                        type="submit"
                        className="btn-primary"
                    >
                        {isEditing ? tButtons("save") : tButtons("confirm")}
                    </button>
                </PermissionGuard>
            </div>
        </form>
    );
}
