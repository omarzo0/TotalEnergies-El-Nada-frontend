"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Input, Select } from "@/ui/Input";
import Button from "@/ui/Button";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { BenzeneRecord } from "../../types/benzene.types";
import { useBenzenePrices } from "../../hooks/useBenzenePrices";

interface BenzeneFormProps {
    initialData?: BenzeneRecord;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export default function BenzeneForm({ initialData, onSubmit, onCancel, isEditing }: BenzeneFormProps) {
    const t = useTranslations("benzene.form");
    const tPrices = useTranslations("benzene.pricesTab");
    const tButtons = useTranslations("buttons");

    // Fetch prices for the record date or today
    const { prices, isLoading: isPricesLoading, error: pricesError } = useBenzenePrices(initialData?.date);

    // Dynamic fuel types and prices from API
    const fuelMapping = useMemo(() => [
        { key: "solarPrice", value: "solar", label: (tPrices("solar") || "Solar").trim() },
        { key: "ben80Price", value: "ben80", label: (tPrices("ben80") || "Benzene 80").trim() },
        { key: "ben92Price", value: "ben92", label: (tPrices("ben92") || "Benzene 92").trim() },
        { key: "ben95Price", value: "ben95", label: (tPrices("ben95") || "Benzene 95").trim() }
    ], [tPrices]);

    const fuelOptions = useMemo(() => {
        return fuelMapping.map(f => ({
            value: f.value,
            label: f.label
        }));
    }, [fuelMapping]);


    const [formData, setFormData] = useState({
        pumpType: initialData?.pumpType || fuelMapping[0].value,
        pumpNumber: initialData?.pumpNumber || 1,
        startBalance: initialData?.startBalance || 0,
        endBalance: initialData?.endBalance || 0,
    });


    const currentPrice = useMemo(() => {
        if (!prices) {
            console.log("BenzeneForm: prices data is null/undefined during price lookup");
            return 0;
        }
        const typeStr = formData.pumpType || "";
        const mapping = fuelMapping.find(f => f.value === typeStr.trim());
        if (!mapping) {
            console.warn(`BenzeneForm: Could not find mapping for fuel type "${formData.pumpType}"`);
            return 0;
        }
        const price = (prices as any)[mapping.key] || 0;
        console.log(`BenzeneForm: Price for "${formData.pumpType}" (key: ${mapping.key}):`, price);
        return price;
    }, [formData.pumpType, prices, fuelMapping]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "pumpType" ? value : Number(value)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            pumpType: formData.pumpType,
            pumpNumber: formData.pumpNumber,
            start: formData.startBalance,
            end: formData.endBalance,
            date: initialData?.date || new Date().toISOString().split('T')[0]
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {isPricesLoading ? (
                <div className="flex items-center gap-2 text-slate-500 py-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm">Fetching latest prices for {initialData?.date || "today"}...</span>
                </div>
            ) : (
                <>
                    {pricesError && (
                        <div className="p-2 mb-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-lg flex items-center gap-2">
                            <i className="bx bx-info-circle"></i>
                            Could not load price info. Prices may show as 0.
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label={t("pumpType")}
                            name="pumpType"
                            value={formData.pumpType}
                            onChange={handleChange}
                            options={fuelOptions}
                            required
                        />
                        <Input
                            label={t("pumpNumber")}
                            name="pumpNumber"
                            type="number"
                            value={formData.pumpNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    {/* Price Display */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">{t("price")}:</span>
                            <span className="text-sm font-bold text-primary">
                                {currentPrice > 0 ? currentPrice.toLocaleString() : "0"} {tPrices("currency")}
                            </span>
                        </div>
                        {currentPrice === 0 && !isPricesLoading && (
                            <p className="text-[10px] text-amber-600 mt-1 italic">
                                * Information: No price found for this fuel type on this date ({initialData?.date || "today"}).
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={onCancel}>
                            {tButtons("cancel")}
                        </Button>
                        <PermissionGuard resource="benzene" action={isEditing ? 'update' : 'create'}>
                            <Button type="submit">
                                {isEditing ? tButtons("save") : tButtons("add")}
                            </Button>
                        </PermissionGuard>
                    </div>
                </>
            )}
        </form>
    );
}
