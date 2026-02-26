"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Input, Select } from "@/ui/Input";
import Button from "@/ui/Button";
import { BenzeneRecord } from "../../types/benzene.types";

interface BenzeneFormProps {
    initialData?: BenzeneRecord;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export default function BenzeneForm({ initialData, onSubmit, onCancel, isEditing }: BenzeneFormProps) {
    const t = useTranslations("benzene.form");
    const tButtons = useTranslations("buttons");

    const [formData, setFormData] = useState({
        type: initialData?.type || "Benzene 95",
        startBalance: initialData?.startBalance || 0,
        endBalance: initialData?.endBalance || 0,
        incoming: initialData?.incoming || 0,
        price: initialData?.price || 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "type" ? value : Number(value)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const sold = formData.startBalance + formData.incoming - formData.endBalance;
        const total = sold * formData.price;
        onSubmit({ ...formData, sold, total });
    };

    const benzeneTypes = [
        { value: "Benzene 95", label: "Benzene 95" },
        { value: "Benzene 92", label: "Benzene 92" },
        { value: "Benzene 80", label: "Benzene 80" }
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Select
                label={t("type")}
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={benzeneTypes}
                required
            />
            <Input
                label={t("startBalance")}
                name="startBalance"
                type="number"
                value={formData.startBalance}
                onChange={handleChange}
                required
            />
            <Input
                label={t("endBalance")}
                name="endBalance"
                type="number"
                value={formData.endBalance}
                onChange={handleChange}
                required
            />
            <Input
                label={t("incoming")}
                name="incoming"
                type="number"
                value={formData.incoming}
                onChange={handleChange}
                required
            />
            <Input
                label={t("price")}
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
            />

            <div className="flex justify-end gap-3 pt-4">
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
