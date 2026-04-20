"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/ui/Input";
import { DeferredClientPayment } from "../../types/deferred-clients.types";
import { useDeferredClientsForm } from "../../hooks/useDeferredClientsForm";
import Button from "@/ui/Button";

interface DeferredClientFormProps {
    initialData?: DeferredClientPayment;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export default function DeferredClientForm({ initialData, onSubmit, onCancel, isEditing }: DeferredClientFormProps) {
    const t = useTranslations("table.clients");
    const tLabels = useTranslations("labels");
    const tButtons = useTranslations("buttons");

    const { formData, errors, handleChange, validate } = useDeferredClientsForm(initialData);

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
                    label={tLabels("client") || "Client Name"}
                    value={formData.clientName}
                    onChange={(e) => handleChange("clientName", e.target.value)}
                    error={errors.clientName}
                    placeholder="e.g. شركة النصر"
                    required
                />
                <Input
                    label={tLabels("receiptName") || "Receipt Name"}
                    value={formData.receiptName}
                    onChange={(e) => handleChange("receiptName", e.target.value)}
                    error={errors.receiptName}
                    placeholder="e.g. توريد وقود"
                    required
                />
                <Input
                    label={tLabels("receiptNumber") || "Receipt Number"}
                    value={formData.receiptNumber}
                    onChange={(e) => handleChange("receiptNumber", e.target.value)}
                    error={errors.receiptNumber}
                    placeholder="e.g. REC-123"
                    required
                />
                <div className="hidden">
                    {/* Placeholder grid spacing if needed */}
                </div>
                <Input
                    label={t("money") || "Money"}
                    type="number"
                    step="0.01"
                    value={formData.money}
                    onChange={(e) => handleChange("money", Number(e.target.value))}
                    error={errors.money}
                    placeholder="0.00"
                    required
                />
            </div>


            <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <Button variant="secondary" onClick={onCancel}>
                    {tButtons("cancel")}
                </Button>
                <Button type="submit" className="shadow-lg shadow-primary/20">
                    {isEditing ? tButtons("save") : tButtons("confirm")}
                </Button>
            </div>
        </form>
    );
}
