"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/ui/Input";
import { ExpenseRecord } from "../../types/expenses.types";
import { useExpensesForm } from "../../hooks/useExpensesForm";

interface ExpenseFormProps {
    initialData?: ExpenseRecord;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export default function ExpenseForm({ initialData, onSubmit, onCancel, isEditing }: ExpenseFormProps) {
    const t = useTranslations("table.expenses");
    const tButtons = useTranslations("buttons");
    const tLabels = useTranslations("labels");
    const { formData, errors, handleChange, validate } = useExpensesForm(initialData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                <Input
                    label={tLabels("receipt")}
                    value={formData.receipt}
                    onChange={(e) => handleChange("receipt", e.target.value)}
                    error={errors.receipt}
                    placeholder="e.g. سند #001"
                />
                <Input
                    label={tLabels("enterAmount")}
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    error={errors.amount}
                    type="number"
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
