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
        { value: "سولار", label: tFuel("diesel") },
        { value: "بنزين 95", label: tFuel("gasoline95") },
        { value: "بنزين 92", label: tFuel("gasoline92") },
        { value: "بنزين 80", label: tFuel("gasoline80") },
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
                <Input
                    label={tLabels("date") || t("date")}
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    error={errors.date}
                />
                <Select
                    label={tLabels("entity") || t("entity")}
                    options={entityOptions}
                    value={formData.side}
                    onChange={(e) => handleChange("side", e.target.value)}
                />
                <Input
                    label={tLabels("enterSerial") || t("serial")}
                    type="number"
                    value={formData.voucherSerial}
                    onChange={(e) => handleChange("voucherSerial", e.target.value)}
                    error={errors.voucherSerial}
                />
                <Input
                    label={tLabels("enterCategory") || t("category")}
                    type="number"
                    value={formData.category}
                    onChange={(e) => handleChange("category", Number(e.target.value))}
                    error={errors.category}
                />

                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                        label={tLabels("selectFuelType") || t("benzType")}
                        options={fuelOptions}
                        value={formData.benzType}
                        onChange={(e) => handleChange("benzType", e.target.value)}
                    />
                    {isEditing && (
                        <>
                            <Input
                                label={t("price")}
                                type="number"
                                value={formData.price || 0}
                                onChange={(e) => handleChange("price", Number(e.target.value))}
                                error={errors.price}
                            />
                            <Input
                                label={t("total")}
                                type="number"
                                value={formData.total || 0}
                                onChange={(e) => handleChange("total", Number(e.target.value))}
                                error={errors.total}
                            />
                        </>
                    )}
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
                    {isEditing ? tButtons("save") : tButtons("confirm")}
                </button>
            </div>
        </form>
    );
}
