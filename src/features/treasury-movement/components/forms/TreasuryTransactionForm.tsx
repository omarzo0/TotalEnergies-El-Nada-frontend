"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Input, Select } from "@/ui/Input";
import { TreasuryTransactionFormData, TreasuryTransaction } from "../../types/treasury-movement.types";

interface TreasuryTransactionFormProps {
    initialData?: TreasuryTransaction;
    onSubmit: (data: TreasuryTransactionFormData) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export default function TreasuryTransactionForm({ initialData, onSubmit, onCancel, isEditing }: TreasuryTransactionFormProps) {
    const tLabels = useTranslations("labels");
    const tStmt = useTranslations("statementTypes");
    const tButtons = useTranslations("buttons");

    const [formData, setFormData] = useState<TreasuryTransactionFormData>({
        amount: initialData?.amount || "",
        receipt: initialData?.receipt || "",
        description: initialData?.description || "clientAccount",
    });

    const statementOptions = [
        { value: "clientAccount", label: tStmt("clientAccount") },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    label={tLabels("amount")}
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0"
                />
                <Input
                    label={tLabels("receipt")}
                    type="text"
                    value={formData.receipt}
                    onChange={(e) => setFormData({ ...formData, receipt: e.target.value })}
                />
                <Select
                    label={tLabels("description")}
                    options={statementOptions}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                    {isEditing ? tButtons("save") : tButtons("add")}
                </button>
            </div>
        </form>
    );
}
