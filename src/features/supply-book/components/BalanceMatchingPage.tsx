"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Modal from "@/components/shared/Modal";
import { useBalanceMatching } from "../hooks/useBalanceMatching";
import { FUEL_TYPES, StandardUpdatePayload } from "../types/supply-book.types";
import { TabItem } from "@/types";
import { Input } from "@/ui/Input";
import Button from "@/ui/Button";
import { BalanceMatchingSkeleton } from "../ui/SupplyBookSkeleton";

const FUEL_KEYS = [FUEL_TYPES.SOLAR, FUEL_TYPES.B80, FUEL_TYPES.B92, FUEL_TYPES.B95];
const BALANCE_ROWS_KEYS = ["startBalance", "incoming", "total", "dispensed", "remaining"] as const;

export default function BalanceMatchingPage() {
    const t = useTranslations("table.balanceMatching");
    const tBalance = useTranslations("balanceItems");
    const tModals = useTranslations("modals");
    const tButtons = useTranslations("buttons");
    const tBenzene = useTranslations("benzene");
    const pathname = usePathname();

    const currentMonth = new Date().getMonth() + 1;
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

    const { balanceData, gauges, isLoading, updateStandard, resetStandard } = useBalanceMatching(selectedMonth, selectedDate);

    const [isEditGaugeOpen, setIsEditGaugeOpen] = useState(false);
    const [gaugeForm, setGaugeForm] = useState({
        standardSolar: 0,
        standardB80: 0,
        standardB92: 0,
        standardB95: 0
    });

    const tabs: TabItem[] = [
        { href: "/supply-book/records", labelKey: "supplyBook", active: false },
        { href: "/supply-book/balance-matching", labelKey: "balanceMatching", active: pathname === "/supply-book/balance-matching" },
    ];

    const columns = [t("gasoline95"), t("gasoline92"), t("gasoline80"), t("diesel"), t("description")];

    // Build balance rows from API data
    const getBalanceValue = (fuelType: string, key: string): string => {
        const fuel = balanceData[fuelType];
        if (!fuel) return "0";
        switch (key) {
            case "startBalance": return (fuel.start || 0).toLocaleString();
            case "incoming": return (fuel.incoming || 0).toLocaleString();
            case "total": return (fuel.total || 0).toLocaleString();
            case "dispensed": return (fuel.dispensed || 0).toLocaleString();
            case "remaining": return (fuel.balance || 0).toLocaleString();
            default: return "0";
        }
    };

    const balanceRows = BALANCE_ROWS_KEYS.map(key => ({
        cells: [
            getBalanceValue(FUEL_TYPES.B95, key),
            getBalanceValue(FUEL_TYPES.B92, key),
            getBalanceValue(FUEL_TYPES.B80, key),
            getBalanceValue(FUEL_TYPES.SOLAR, key),
            tBalance(key)
        ],
        id: key
    }));

    // Build gauge row
    const getGaugeValue = (fuelType: string, camelKey: string): number => {
        return gauges[fuelType] ?? (gauges as any)[camelKey] ?? 0;
    };

    const gaugeRow = {
        cells: [
            getGaugeValue(FUEL_TYPES.B95, "standardB95").toLocaleString(),
            getGaugeValue(FUEL_TYPES.B92, "standardB92").toLocaleString(),
            getGaugeValue(FUEL_TYPES.B80, "standardB80").toLocaleString(),
            getGaugeValue(FUEL_TYPES.SOLAR, "standardSolar").toLocaleString(),
            tBalance("standard")
        ],
        editable: true,
        id: "gauge"
    };

    const handleEditGauge = () => {
        setGaugeForm({
            standardSolar: getGaugeValue(FUEL_TYPES.SOLAR, "standardSolar"),
            standardB80: getGaugeValue(FUEL_TYPES.B80, "standardB80"),
            standardB92: getGaugeValue(FUEL_TYPES.B92, "standardB92"),
            standardB95: getGaugeValue(FUEL_TYPES.B95, "standardB95")
        });
        setIsEditGaugeOpen(true);
    };

    const handleSaveGauge = async () => {
        const payload: StandardUpdatePayload = {
            date: selectedDate,
            ...gaugeForm
        };
        await updateStandard(payload);
        setIsEditGaugeOpen(false);
    };

    const handleResetGauge = async () => {
        await resetStandard(selectedDate);
    };

    const months = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: new Date(2026, i).toLocaleString('default', { month: 'long' })
    }));

    return (
        <div className="pb-10">
            <Header titleKey="balanceMatching" tabs={tabs} />

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm h-[42px]">
                        <i className="bx bx-calendar text-slate-400"></i>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer"
                        >
                            {months.map(m => (
                                <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm h-[42px]">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{tBenzene("pricesTab.date")}:</span>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {isLoading ? (
                <BalanceMatchingSkeleton />
            ) : (
                <>
                    {/* Balance Table */}
                    <div className="page-card shadow-glass mb-8 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        {columns.map((col, i) => (
                                            <th key={i} className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {balanceRows.map((row, i) => (
                                        <tr key={row.id} className={`border-b border-slate-50 ${i === balanceRows.length - 1 ? 'bg-primary/5 font-bold' : 'hover:bg-slate-50'}`}>
                                            {row.cells.map((cell, j) => (
                                                <td key={j} className="px-4 py-3 text-center text-slate-700">{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Gauges Section */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <i className="bx bx-tachometer text-primary"></i>
                            {tBalance("pumpGauges")}
                        </h2>
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={handleResetGauge} className="text-xs">
                                <i className="bx bx-reset me-1"></i>
                                {tButtons("reset") || "Reset"}
                            </Button>
                            <Button onClick={handleEditGauge} className="text-xs">
                                <i className="bx bx-edit me-1"></i>
                                {tButtons("edit") || "Edit"}
                            </Button>
                        </div>
                    </div>

                    <div className="page-card shadow-glass overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        {columns.map((col, i) => (
                                            <th key={i} className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="hover:bg-slate-50">
                                        {gaugeRow.cells.map((cell, j) => (
                                            <td key={j} className="px-4 py-3 text-center text-slate-700 font-semibold">{cell}</td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Edit Gauge Modal */}
            <Modal
                isOpen={isEditGaugeOpen}
                onClose={() => setIsEditGaugeOpen(false)}
                title={tBalance("pumpGauges") || "Edit Standard Gauges"}
            >
                <div className="space-y-4">
                    <Input
                        label={`${t("diesel")} (${FUEL_TYPES.SOLAR})`}
                        type="number"
                        value={gaugeForm.standardSolar}
                        onChange={(e) => setGaugeForm({ ...gaugeForm, standardSolar: Number(e.target.value) })}
                        placeholder="0"
                    />
                    <Input
                        label={`${t("gasoline80")} (${FUEL_TYPES.B80})`}
                        type="number"
                        value={gaugeForm.standardB80}
                        onChange={(e) => setGaugeForm({ ...gaugeForm, standardB80: Number(e.target.value) })}
                        placeholder="0"
                    />
                    <Input
                        label={`${t("gasoline92")} (${FUEL_TYPES.B92})`}
                        type="number"
                        value={gaugeForm.standardB92}
                        onChange={(e) => setGaugeForm({ ...gaugeForm, standardB92: Number(e.target.value) })}
                        placeholder="0"
                    />
                    <Input
                        label={`${t("gasoline95")} (${FUEL_TYPES.B95})`}
                        type="number"
                        value={gaugeForm.standardB95}
                        onChange={(e) => setGaugeForm({ ...gaugeForm, standardB95: Number(e.target.value) })}
                        placeholder="0"
                    />
                    <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                        <Button variant="secondary" onClick={() => setIsEditGaugeOpen(false)}>
                            {tButtons("cancel")}
                        </Button>
                        <Button onClick={handleSaveGauge} className="shadow-lg shadow-primary/20">
                            {tButtons("save")}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
