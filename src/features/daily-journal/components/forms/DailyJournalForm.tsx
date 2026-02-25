"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Input, TextArea } from "@/ui/Input";
import { DailyJournalFormData, DailyJournalRecord } from "../../types/daily-journal.types";

interface DailyJournalFormProps {
    initialData?: DailyJournalRecord;
    onSubmit: (data: DailyJournalFormData) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export default function DailyJournalForm({ initialData, onSubmit, onCancel, isEditing }: DailyJournalFormProps) {
    const tLabels = useTranslations("labels");
    const tTable = useTranslations("table.dailyJournal");
    const tButtons = useTranslations("buttons");

    const [formData, setFormData] = useState<DailyJournalFormData>({
        priceDiff: initialData?.priceDiff || "",
        transfer: initialData?.transfer || "",
        description: initialData?.description || "",
        creditor: initialData?.creditor || "",
        debtor: initialData?.debtor || "",
        date: initialData?.date || new Date().toISOString().split('T')[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    label={tTable("priceDiff")}
                    type="number"
                    value={formData.priceDiff}
                    onChange={(e) => setFormData({ ...formData, priceDiff: e.target.value })}
                    placeholder="0"
                />
                <Input
                    label={tTable("transfer")}
                    type="number"
                    value={formData.transfer}
                    onChange={(e) => setFormData({ ...formData, transfer: e.target.value })}
                    placeholder="0"
                />
                <Input
                    label={tTable("creditor")}
                    type="number"
                    value={formData.creditor}
                    onChange={(e) => setFormData({ ...formData, creditor: e.target.value })}
                    placeholder="0"
                />
                <Input
                    label={tTable("debtor")}
                    type="number"
                    value={formData.debtor}
                    onChange={(e) => setFormData({ ...formData, debtor: e.target.value })}
                    placeholder="0"
                />
                <div className="sm:col-span-2">
                    <TextArea
                        label={tTable("description")}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
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
