"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/ui/Input";
import { Expense } from "../../types/expenses.types";
import { useExpensesForm } from "../../hooks/useExpensesForm";
import Button from "@/ui/Button";

interface ExpenseFormProps {
    initialData?: Expense;
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
                    label={t("receiptName") || "Receipt Name"}
                    value={formData.receiptName}
                    onChange={(e) => handleChange("receiptName", e.target.value)}
                    error={errors.receiptName}
                    placeholder="e.g. فاتورة كهرباء"
                    required
                />
                <Input
                    label={t("amount") || "Amount"}
                    value={formData.money}
                    onChange={(e) => handleChange("money", Number(e.target.value))}
                    error={errors.money}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    required
                />
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <Button variant="secondary" onClick={onCancel}>
                    {tButtons("cancel")}
                </Button>
                <Button type="submit">
                    {isEditing ? tButtons("save") : tButtons("confirm")}
                </Button>
            </div>
        </form>
    );
}
