"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/ui/Input";
import Image from "next/image";
import { OilRecord, OilRecordType } from "../../types/oils.types";
import { useOilsForm } from "../../hooks/useOilsForm";

interface OilFormProps {
    type: OilRecordType;
    initialData?: OilRecord;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export default function OilForm({ type, initialData, onSubmit, onCancel, isEditing }: OilFormProps) {
    const t = useTranslations("table.oils");
    const tStorage = useTranslations("table.oilStorage");
    const tLabels = useTranslations("labels");
    const tButtons = useTranslations("buttons");
    const { formData, errors, handleChange, validate } = useOilsForm(initialData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    const incomingLabel = type === 'shift' ? t("incoming") : tStorage("storageIncoming");

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                    {tLabels("selectOilType")}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label={t("oilType")}
                        value={formData.oilType}
                        onChange={(e) => handleChange("oilType", e.target.value)}
                        error={errors.oilType}
                        placeholder="e.g. Total Quartz"
                        disabled={isEditing}
                    />
                    <Input
                        label={incomingLabel}
                        value={formData.incoming}
                        onChange={(e) => handleChange("incoming", e.target.value)}
                        type="number"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label={t("startBalance")}
                    value={formData.startBalance}
                    onChange={(e) => handleChange("startBalance", e.target.value)}
                    type="number"
                />
                <Input
                    label={t("endBalance")}
                    value={formData.endBalance}
                    onChange={(e) => handleChange("endBalance", e.target.value)}
                    type="number"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">{t("image")}</label>
                {isEditing ? (
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-sm border border-slate-200 group">
                        <Image
                            src={formData.image}
                            alt="Current Preview"
                            fill
                            className="object-cover"
                            unoptimized
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
