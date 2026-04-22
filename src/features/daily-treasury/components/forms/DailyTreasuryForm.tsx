"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/ui/Input";
import { TreasuryManualEntry } from "../../types/daily-treasury.types";
import { useDailyTreasuryForm } from "../../hooks/useDailyTreasuryForm";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";

interface DailyTreasuryFormProps {
    initialData?: Partial<TreasuryManualEntry>;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export default function DailyTreasuryForm({ initialData, onSubmit, onCancel }: DailyTreasuryFormProps) {
    const t = useTranslations("dailyTreasury");
    const tButtons = useTranslations("buttons");

    const { displayData, errors, handleChange, validate, formData } = useDailyTreasuryForm(initialData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-2">
                    <Input
                        label={t("statement")}
                        value={displayData.statement}
                        onChange={(e) => handleChange("statement", e.target.value)}
                        error={errors.statement}
                        placeholder={t("enterStatement")}
                    />
                </div>
                <Input
                    label={t("money")}
                    type="number"
                    value={displayData.money}
                    onChange={(e) => handleChange("money", e.target.value)}
                    error={errors.money}
                    placeholder="0.00"
                />
                <Input
                    label={t("quantity")}
                    type="number"
                    value={displayData.quantity}
                    onChange={(e) => handleChange("quantity", e.target.value)}
                    placeholder="0"
                />
                <Input
                    label={t("price")}
                    type="number"
                    value={displayData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="0.00"
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
                <PermissionGuard resource="dailyTreasury" action={initialData?.id ? 'update' : 'create'}>
                    <button
                        type="submit"
                        className="btn-primary"
                    >
                        {tButtons("confirm")}
                    </button>
                </PermissionGuard>
            </div>
        </form>
    );
}
