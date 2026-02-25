"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Input, Select } from "@/ui/Input";
import { TreasuryAccountFormData, TreasuryAccount } from "../../types/treasury-movement.types";

interface TreasuryAccountFormProps {
    initialData?: TreasuryAccount;
    onSubmit: (data: TreasuryAccountFormData) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export default function TreasuryAccountForm({ initialData, onSubmit, onCancel, isEditing }: TreasuryAccountFormProps) {
    const tLabels = useTranslations("labels");
    const tButtons = useTranslations("buttons");

    const [formData, setFormData] = useState<TreasuryAccountFormData>({
        amount: initialData?.amount || "",
        receipt: initialData?.receipt || "",
        accountant: "sayed", // Accountant logic can be refined if needed, usually it's just a selection
    });

    const accountantOptions = [
        { value: "sayed", label: "الحاج سيد" },
        { value: "sami", label: "الحاج سامي" },
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
                    label={tLabels("accountant")}
                    options={accountantOptions}
                    value={formData.accountant}
                    onChange={(e) => setFormData({ ...formData, accountant: e.target.value })}
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
