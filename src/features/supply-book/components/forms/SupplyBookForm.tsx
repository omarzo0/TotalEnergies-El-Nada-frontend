"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Input, Select } from "@/ui/Input";
import { SupplyBookRecord, SupplyBookFormData, FUEL_TYPES } from "../../types/supply-book.types";
import { benzeneApi } from "@/features/benzene/api/benzene.api";
import Button from "@/ui/Button";


interface SupplyBookFormProps {
    initialData?: SupplyBookRecord;
    onSubmit: (data: SupplyBookFormData) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export default function SupplyBookForm({ initialData, onSubmit, onCancel, isEditing }: SupplyBookFormProps) {
    const tFuel = useTranslations("fuelTypes");
    const tButtons = useTranslations("buttons");
    const tSupply = useTranslations("table.supplyBook");

    const [formData, setFormData] = useState<SupplyBookFormData>({
        date: initialData?.date || new Date().toISOString().split('T')[0],
        benzType: initialData?.benzType || FUEL_TYPES.SOLAR,
        start: initialData?.start || 0,
        incoming: initialData?.incoming || 0,
        pumps: initialData?.pumps || "",
        standard: initialData?.standard || 0,
    });

    const [isFetchingPumps, setIsFetchingPumps] = useState(false);

    // Auto-fetch pump numbers when date or fuel type changes
    useEffect(() => {
        const fetchPumps = async () => {
            if (!formData.date || !formData.benzType || isEditing) return;

            try {
                setIsFetchingPumps(true);
                const readings = await benzeneApi.getPumpReadingsByType(formData.date, formData.benzType);
                if (readings.length > 0) {
                    const pumpNumbers = readings
                        .map(r => r.pumpNumber)
                        .sort((a, b) => a - b)
                        .join(", ");
                    setFormData(prev => ({ ...prev, pumps: pumpNumbers }));
                } else if (formData.pumps === "") {
                    // Only clear if it was already empty or auto-filled
                    setFormData(prev => ({ ...prev, pumps: "" }));
                }
            } catch (error) {
                console.error("Failed to fetch pump numbers:", error);
            } finally {
                setIsFetchingPumps(false);
            }
        };

        fetchPumps();
    }, [formData.date, formData.benzType, isEditing]);

    const fuelOptions = [
        { value: FUEL_TYPES.SOLAR, label: tFuel("diesel") },
        { value: FUEL_TYPES.B80, label: tFuel("gasoline80") },
        { value: FUEL_TYPES.B92, label: tFuel("gasoline92") },
        { value: FUEL_TYPES.B95, label: tFuel("gasoline95") },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Input
                label={tSupply("date")}
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />

            <Select
                label={tSupply("benzType") || "Fuel Type"}
                options={fuelOptions}
                value={formData.benzType}
                onChange={(e) => setFormData({ ...formData, benzType: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    label={tSupply("start")}
                    type="number"
                    value={formData.start}
                    onChange={(e) => setFormData({ ...formData, start: Number(e.target.value) })}
                    placeholder="0"
                />
                <Input
                    label={tSupply("incoming")}
                    type="number"
                    value={formData.incoming}
                    onChange={(e) => setFormData({ ...formData, incoming: Number(e.target.value) })}
                    placeholder="0"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    label={tSupply("pumps")}
                    value={formData.pumps}
                    onChange={(e) => setFormData({ ...formData, pumps: e.target.value })}
                    placeholder={isFetchingPumps ? "Loading..." : (tSupply("pumpsPlaceholder") || "Leave blank to auto-sync from benzene records")}
                />
                <Input
                    label={tSupply("standard")}
                    type="number"
                    value={formData.standard}
                    onChange={(e) => setFormData({ ...formData, standard: Number(e.target.value) })}
                    placeholder="0"
                />
            </div>

            {/* Auto-calculated fields info */}
            {isEditing && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-primary flex items-start gap-3">
                    <i className="bx bx-info-circle text-xl mt-0.5"></i>
                    <div>
                        <p className="font-bold mb-1">Smart Re-calculation</p>
                        <p className="opacity-80 leading-relaxed">
                            The system will automatically re-calculate <span className="font-bold underline">dispensed</span>, <span className="font-bold underline">end balance</span>, and <span className="font-bold underline">pump numbers</span> based on the benzene readings for this date and fuel type.
                        </p>
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <Button variant="secondary" onClick={onCancel}>
                    {tButtons("cancel")}
                </Button>
                <Button type="submit" className="shadow-lg shadow-primary/20">
                    {isEditing ? tButtons("save") : tButtons("add")}
                </Button>
            </div>
        </form>
    );
}
