"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Input, Select } from "@/ui/Input";
import { SupplyBookFormData, SupplyBookRecord } from "../../types/supply-book.types";

interface SupplyBookFormProps {
    initialData?: SupplyBookRecord;
    onSubmit: (data: SupplyBookFormData) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export default function SupplyBookForm({ initialData, onSubmit, onCancel, isEditing }: SupplyBookFormProps) {
    const tLabels = useTranslations("labels");
    const tFuel = useTranslations("fuelTypes");
    const tButtons = useTranslations("buttons");
    const tSupply = useTranslations("table.supplyBook");

    const [formData, setFormData] = useState<SupplyBookFormData>({
        standard: initialData?.standard || "",
        end: initialData?.end || "",
        start: initialData?.start || "",
        pumps: initialData?.pumps || "",
        dispensed: initialData?.dispensed || "",
        incoming: initialData?.incoming || "",
        fuelType: initialData?.fuelType || "diesel",
        date: initialData?.date || new Date().toISOString().split('T')[0],
    });

    const fuelOptions = [
        { value: "diesel", label: tFuel("diesel") },
        { value: "gasoline95", label: tFuel("gasoline95") },
        { value: "gasoline92", label: tFuel("gasoline92") },
        { value: "gasoline80", label: tFuel("gasoline80") },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Select
                label={tLabels("selectFuelType")}
                options={fuelOptions}
                value={formData.fuelType}
                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
            />
            <Input
                label={tSupply("standard")}
                type="number"
                value={formData.standard}
                onChange={(e) => setFormData({ ...formData, standard: e.target.value })}
                placeholder="0"
            />
            <Input
                label={tSupply("start")}
                type="number"
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                placeholder="0"
            />
            <Input
                label={tSupply("end")}
                type="number"
                value={formData.end}
                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                placeholder="0"
            />
            <Input
                label={tSupply("pumps")}
                type="number"
                value={formData.pumps}
                onChange={(e) => setFormData({ ...formData, pumps: e.target.value })}
                placeholder="0"
            />
            <Input
                label={tSupply("dispensed")}
                type="number"
                value={formData.dispensed}
                onChange={(e) => setFormData({ ...formData, dispensed: e.target.value })}
                placeholder="0"
            />
            <Input
                label={tSupply("incoming")}
                type="number"
                value={formData.incoming}
                onChange={(e) => setFormData({ ...formData, incoming: e.target.value })}
                placeholder="0"
            />

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
