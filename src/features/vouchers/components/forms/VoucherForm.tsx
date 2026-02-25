"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Input, Select } from "@/ui/Input";
import { VoucherRecord } from "../../types/vouchers.types";
import { useVouchersForm } from "../../hooks/useVouchersForm";

interface VoucherFormProps {
    initialData?: VoucherRecord;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export default function VoucherForm({ initialData, onSubmit, onCancel, isEditing }: VoucherFormProps) {
    const t = useTranslations("table.vouchers");
    const tLabels = useTranslations("labels");
    const tFuel = useTranslations("fuelTypes");
    const tEntities = useTranslations("entities");
    const tButtons = useTranslations("buttons");

    const { formData, errors, handleChange, validate } = useVouchersForm(initialData);

    const fuelOptions = [
        { value: "diesel", label: tFuel("diesel") },
        { value: "gasoline95", label: tFuel("gasoline95") },
        { value: "gasoline92", label: tFuel("gasoline92") },
        { value: "gasoline80", label: tFuel("gasoline80") },
    ];

    const entityOptions = [
        { value: "police", label: tEntities("police") },
        { value: "association", label: tEntities("association") },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                    label={tLabels("entity")}
                    options={entityOptions}
                    value={formData.entity}
                    onChange={(e) => handleChange("entity", e.target.value)}
                />
                <Input
                    label={tLabels("enterSerial")}
                    type="number"
                    value={formData.serial}
                    onChange={(e) => handleChange("serial", e.target.value)}
                    error={errors.serial}
                />
                <Input
                    label={tLabels("enterCategory")}
                    type="text"
                    value={formData.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    error={errors.category}
                />
                <Input
                    label={t("price")}
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    error={errors.price}
                />
                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                        label={tLabels("selectFuelType")}
                        options={fuelOptions}
                        value={formData.fuelType}
                        onChange={(e) => handleChange("fuelType", e.target.value)}
                    />
                    <Input
                        label={t("total")}
                        type="number"
                        value={formData.total}
                        onChange={(e) => handleChange("total", e.target.value)}
                        error={errors.total}
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
