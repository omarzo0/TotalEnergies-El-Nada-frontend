"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { useDailyTreasury } from "../hooks/useDailyTreasury";
import DailyTreasuryForm from "./forms/DailyTreasuryForm";
import { DataRow } from "@/types";
import { DailyTreasurySkeleton } from "../ui/DailyTreasurySkeleton";

export default function DailyTreasuryPage() {
    const t = useTranslations("dailyTreasury");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");

    const {
        summary,
        isLoading,
        error,
        date,
        setDate,
        updateIsland,
        updateFromShift,
        addManualEntry,
        deleteManualEntry,
        refresh
    } = useDailyTreasury();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditIslandOpen, setIsEditIslandOpen] = useState(false);
    const [isEditShiftOpen, setIsEditShiftOpen] = useState(false);

    // Island local state for editing
    const [islandData, setIslandData] = useState({ quantity: 0, price: 0 });
    const [shiftData, setShiftData] = useState({ quantity: 0, price: 0 });

    const openIslandEdit = () => {
        if (summary?.island) {
            setIslandData({ quantity: summary.island.quantity, price: summary.island.price });
            setIsEditIslandOpen(true);
        }
    };

    const openShiftEdit = () => {
        if (summary?.fromShift) {
            setShiftData({ quantity: summary.fromShift.quantity, price: summary.fromShift.price });
            setIsEditShiftOpen(true);
        }
    };

    const handleIslandSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateIsland(islandData.quantity, islandData.price);
        setIsEditIslandOpen(false);
    };

    const handleShiftSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateFromShift(shiftData.quantity, shiftData.price);
        setIsEditShiftOpen(false);
    };

    // Table Columns for Manual Entries
    const manualColumns = [
        t("statement"),
        t("quantity"),
        t("price"),
        t("money")
    ];

    const manualRows: DataRow[] = (summary?.manualEntries || []).map(entry => ({
        cells: [
            entry.statement || "-",
            (entry.quantity || 0).toString(),
            (entry.price || 0).toLocaleString(),
            (entry.money || 0).toLocaleString()
        ],
        id: entry.id || entry._id || (entry as any).id
    }));

    return (
        <div className="pb-10">
            <Header titleKey="dailyTreasury" />

            {/* Date Filter */}
            <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-500">{t("date")}:</span>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-slate-50 border-none rounded-lg text-sm font-bold text-slate-700 cursor-pointer focus:ring-primary"
                    />
                </div>
                <button
                    onClick={refresh}
                    className="btn-secondary flex items-center gap-2"
                >
                    <i className="bx bx-refresh text-lg"></i>
                    {tButtons("search")}
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-3">
                    <i className="bx bx-error-circle text-2xl"></i>
                    <p>{error}</p>
                </div>
            )}

            {isLoading ? (
                <DailyTreasurySkeleton />
            ) : summary && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Analytics Section */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <SummaryCard title={t("totalIncome")} value={summary.totalIncome || 0} icon="bx-gas-pump" color="primary" />
                            <SummaryCard title={t("oilSales")} value={summary.oils?.money || 0} icon="bx-droplet" color="orange" />
                            <SummaryCard title={t("totalSafe")} value={summary.safe || 0} icon="bx-wallet" color="green" />
                        </div>

                        {/* Fuel Breakdown Grid */}
                        <div className="page-card">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <i className="bx bxs-gas-pump text-primary"></i>
                                {t("fuelBreakdown")}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FuelDetailCard type={t("solar")} data={summary.fuel?.solar} />
                                <FuelDetailCard type={t("ben80")} data={summary.fuel?.ben80} />
                                <FuelDetailCard type={t("ben92")} data={summary.fuel?.ben92} />
                                <FuelDetailCard type={t("ben95")} data={summary.fuel?.ben95} />
                            </div>
                        </div>

                        {/* Summary highlights / Direct Entries */}
                        <div className="page-card">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <i className="bx bx-star text-primary"></i>
                                {t("summaryHighlights")}
                            </h3>
                            <div className="divide-y">
                                <HighlightRow
                                    label={t("island")}
                                    quantity={summary.island?.quantity || 0}
                                    price={summary.island?.price || 0}
                                    total={summary.island?.money || 0}
                                    onEdit={openIslandEdit}
                                />
                                <HighlightRow
                                    label={t("fromShift")}
                                    quantity={summary.fromShift?.quantity || 0}
                                    price={summary.fromShift?.price || 0}
                                    total={summary.fromShift?.money || 0}
                                    onEdit={openShiftEdit}
                                />
                            </div>
                        </div>

                        {/* Manual Entries Section */}
                        <div className="page-card">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <i className="bx bx-plus-circle text-primary"></i>
                                    {t("manualEntries")}
                                </h3>
                                <button onClick={() => setIsCreateOpen(true)} className="btn-primary-sm flex items-center gap-1">
                                    <i className="bx bx-plus text-base"></i>
                                    {tButtons("add")}
                                </button>
                            </div>
                            <DataTable
                                columns={manualColumns}
                                rows={manualRows}
                                onDelete={(idx) => deleteManualEntry(manualRows[idx].id!)}
                            />
                        </div>
                    </div>

                    {/* Sidebar / Financial Breakdown */}
                    <div className="space-y-6">
                        {/* Oil Sales Detail */}
                        <div className="page-card bg-orange-50/30 border-orange-100">
                            <p className="text-xs font-bold text-orange-600 uppercase mb-3 flex items-center gap-1">
                                <i className="bx bx-droplet"></i> {t("oilSales")}
                            </p>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-2xl font-black text-slate-800">{(summary.oils?.money ?? 0).toLocaleString()}</p>

                                    <p className="text-xs text-slate-500 font-medium">{summary.oils?.quantity || 0} {t("quantity")}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">LUBRICANTS</span>
                                </div>
                            </div>
                        </div>

                        {/* Deductions Card */}
                        <div className="page-card bg-slate-50/50">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <i className="bx bx-minus-circle text-red-500"></i>
                                {t("deductions")}
                            </h3>
                            <div className="space-y-4">
                                <DeductionItem
                                    label={t("expenses")}
                                    value={summary.deductions?.expenses?.total || 0}
                                    count={summary.deductions?.expenses?.count}
                                />
                                <DeductionItem
                                    label={t("vouchers")}
                                    value={summary.deductions?.vouchers?.total || 0}
                                    count={summary.deductions?.vouchers?.count}
                                />
                                <DeductionItem
                                    label={t("termClients")}
                                    value={summary.deductions?.termClients?.total || 0}
                                    count={summary.deductions?.termClients?.count}
                                />
                                <div className="pt-4 border-t border-slate-200 mt-4">
                                    <div className="flex justify-between items-center font-bold text-slate-800">
                                        <span>{t("totalDeductions")}</span>
                                        <span className="text-red-600">
                                            -{(summary.totalDeductions || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Safe Totals Card */}
                        <div className="page-card bg-primary/5 border-primary/10 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <i className="bx bx-wallet text-6xl text-primary"></i>
                            </div>
                            <div className="relative z-10">
                                <p className="text-sm font-semibold text-primary/70 mb-1 uppercase tracking-wider">{t("totalSafe")}</p>
                                <p className="text-4xl font-black text-primary">{(summary.safe ?? 0).toLocaleString()} <span className="text-sm font-normal">EGP</span></p>


                                <div className="mt-4 pt-4 border-t border-primary/10 space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-slate-500">
                                        <span>{t("lastSafe")}</span>
                                        <span>{(summary.lastSafe ?? 0).toLocaleString()} EGP</span>

                                    </div>
                                    <p className="text-[10px] text-primary/60 leading-tight">Final audited balance for the selected transaction period.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title={tModals("createRecordTitle")}>
                <DailyTreasuryForm
                    onSubmit={async (data) => {
                        await addManualEntry(data);
                        setIsCreateOpen(false);
                    }}
                    onCancel={() => setIsCreateOpen(false)}
                />
            </Modal>

            {/* Island Update Modal */}
            <Modal isOpen={isEditIslandOpen} onClose={() => setIsEditIslandOpen(false)} title={t("island")}>
                <form onSubmit={handleIslandSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">{t("quantity")}</label>
                            <input
                                type="number"
                                value={islandData.quantity}
                                onChange={e => setIslandData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                                className="input-field"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">{t("price")}</label>
                            <input
                                type="number"
                                value={islandData.price}
                                onChange={e => setIslandData(prev => ({ ...prev, price: Number(e.target.value) }))}
                                className="input-field"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={() => setIsEditIslandOpen(false)} className="btn-secondary">{tButtons("cancel")}</button>
                        <button type="submit" className="btn-primary">{tButtons("save")}</button>
                    </div>
                </form>
            </Modal>

            {/* From Shift Update Modal */}
            <Modal isOpen={isEditShiftOpen} onClose={() => setIsEditShiftOpen(false)} title={t("fromShift")}>
                <form onSubmit={handleShiftSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">{t("quantity")}</label>
                            <input
                                type="number"
                                value={shiftData.quantity}
                                onChange={e => setShiftData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                                className="input-field"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-slate-700">{t("price")}</label>
                            <input
                                type="number"
                                value={shiftData.price}
                                onChange={e => setShiftData(prev => ({ ...prev, price: Number(e.target.value) }))}
                                className="input-field"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={() => setIsEditShiftOpen(false)} className="btn-secondary">{tButtons("cancel")}</button>
                        <button type="submit" className="btn-primary">{tButtons("save")}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

function FuelDetailCard({ type, data }: { type: string; data?: { quantity: number; price: number; money: number } }) {
    return (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1 hover:bg-slate-100 transition-colors">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{type}</p>
            <p className="text-lg font-black text-slate-800">{(data?.money ?? 0).toLocaleString()} <span className="text-xs font-normal text-slate-400">EGP</span></p>

            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                <span>{data?.quantity || 0} L</span>
                <span>@ {data?.price || 0}</span>
            </div>
        </div>
    );
}

function SummaryCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
    const colorClasses: any = {
        primary: "text-primary bg-primary/10 border-primary/20",
        orange: "text-orange-500 bg-orange-50 border-orange-200",
        green: "text-emerald-500 bg-emerald-50 border-emerald-200"
    };

    return (
        <div className={`p-5 rounded-2xl border ${colorClasses[color]} flex flex-col gap-1`}>
            <div className="flex justify-between items-center mb-1">
                <i className={`bx ${icon} text-2xl opacity-80`}></i>
            </div>
            <p className="text-2xl font-black">{(value ?? 0).toLocaleString()}</p>

            <p className="text-xs font-bold uppercase tracking-tight opacity-70">{title}</p>
        </div>
    );
}

function HighlightRow({ label, quantity, price, total, onEdit }: { label: string; quantity: number; price: number; total: number; onEdit: () => void }) {
    return (
        <div className="flex justify-between items-center py-4 group hover:px-2 -mx-2 rounded-xl transition-all">
            <div className="flex flex-col">
                <span className="font-bold text-slate-800">{label}</span>
                <span className="text-xs text-slate-400">{quantity} @ {(price ?? 0).toLocaleString()}</span>

            </div>
            <div className="flex items-center gap-4">
                <span className="font-black text-slate-700">{(total ?? 0).toLocaleString()}</span>

                <button onClick={onEdit} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors">
                    <i className="bx bx-edit-alt text-lg"></i>
                </button>
            </div>
        </div>
    );
}

function DeductionItem({ label, value, count }: { label: string; value: number; count?: number }) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-500">{label}</span>
                {count !== undefined && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Items: {count}</span>}
            </div>
            <span className="text-sm font-bold text-slate-700">{(value ?? 0).toLocaleString()}</span>

        </div>
    );
}
