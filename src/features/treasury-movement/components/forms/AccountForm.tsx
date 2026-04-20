"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/ui/Input";
import Button from "@/ui/Button";
import { Account, AccountFormData } from "../../types/treasury-movement.types";

interface AccountFormProps {
    initialData?: Account;
    selectedDate?: string;
    onSubmit: (data: AccountFormData) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export default function AccountForm({ initialData, selectedDate, onSubmit, onCancel, isEditing }: AccountFormProps) {
    const t = useTranslations("treasuryMovement");
    const tLabel = useTranslations("labels");
    const tButtons = useTranslations("buttons");

    const [formData, setFormData] = useState<AccountFormData>({
        date: initialData?.date || selectedDate || new Date().toISOString().split("T")[0],
        name: initialData?.name || "",
        receiptName: initialData?.receiptName || "",
        money: initialData?.money || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'money' ? Number(value) : value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {isEditing && (
                <Input
                    label={t("date")}
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
            )}

            <Input
                label={tLabel("name")}
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="مثال: ح/العملاء"
                required
            />

            <Input
                label={t("receiptName")}
                name="receiptName"
                value={formData.receiptName}
                onChange={handleChange}
                placeholder="مثال: سند رقم 100"
                required
            />

            <Input
                label={t("money")}
                name="money"
                type="number"
                value={formData.money}
                onChange={handleChange}
                required
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    {tButtons("cancel")}
                </Button>
                <Button type="submit">
                    {isEditing ? tButtons("save") : tButtons("add")}
                </Button>
            </div>
        </form>
    );
}
