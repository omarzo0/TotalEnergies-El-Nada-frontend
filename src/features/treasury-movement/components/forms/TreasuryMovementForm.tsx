"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Input, Select } from "@/ui/Input";
import Button from "@/ui/Button";
import { TreasuryMovement, TreasuryMovementFormData } from "../../types/treasury-movement.types";

interface TreasuryMovementFormProps {
    initialData?: TreasuryMovement;
    onSubmit: (data: TreasuryMovementFormData) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export default function TreasuryMovementForm({ initialData, onSubmit, onCancel, isEditing }: TreasuryMovementFormProps) {
    const t = useTranslations("treasuryMovement");
    const tButtons = useTranslations("buttons");

    const [formData, setFormData] = useState<TreasuryMovementFormData>({
        date: initialData?.date || new Date().toISOString().split("T")[0],
        type: initialData?.type || "مقبوضات",
        statement: initialData?.statement || "",
        receiptName: initialData?.receiptName || "",
        money: initialData?.money || 0,
        description: initialData?.description || "",
    });

    const typeOptions = [
        { value: "مقبوضات", label: t("income") },
        { value: "مدفوعات", label: t("expense") },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'money' ? Number(value) : value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label={t("date")}
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
                <Select
                    label={t("type")}
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    options={typeOptions}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label={t("statement")}
                    name="statement"
                    value={formData.statement}
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
            </div>

            <Input
                label={t("money")}
                name="money"
                type="number"
                value={formData.money}
                onChange={handleChange}
                required
            />

            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">{t("description")}</label>
                <textarea
                    name="description"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 
                             focus:border-primary transition-all duration-200 min-h-[100px] outline-none"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="..."
                />
            </div>

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
