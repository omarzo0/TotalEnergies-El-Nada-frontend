"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/ui/Input";
import { DeferredClientRecord } from "../../types/deferred-clients.types";
import { useDeferredClientsForm } from "../../hooks/useDeferredClientsForm";

interface DeferredClientFormProps {
    initialData?: DeferredClientRecord;
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
                    label={tLabels("client")}
                    value={formData.client}
                    onChange={(e) => handleChange("client", e.target.value)}
                    error={errors.client}
                    placeholder="e.g. عميل 1"
                />
                <Input
                    label={tLabels("receipt")}
                    value={formData.receipt}
                    onChange={(e) => handleChange("receipt", e.target.value)}
                    error={errors.receipt}
                    placeholder="e.g. سند #100"
                />
                <div className="sm:col-span-2">
                    <Input
                        label={tLabels("amount")}
                        type="number"
                        value={formData.amount}
                        onChange={(e) => handleChange("amount", e.target.value)}
                        error={errors.amount}
                        placeholder="0.00"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">{t("image")}</label>
                {isEditing ? (
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-sm border border-slate-200 group">
                        <img
                            src={formData.image}
                            alt="Current Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="text-white text-xs font-bold uppercase tracking-wider">{tButtons("attachImage")}</span>
                        </div>
                    </div>
                ) : (
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer group">
                        <i className="bx bx-cloud-upload text-3xl text-slate-300 group-hover:text-primary transition-colors"></i>
                        <p className="text-sm text-slate-400 mt-2">{tButtons("attachImage")}</p>
                    </div>
                )}
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
