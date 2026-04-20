"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { useBenzene } from "../hooks/useBenzene";
import BenzeneForm from "./forms/BenzeneForm";
import BenzenePricesTab from "./BenzenePricesTab";
import { BenzeneTableSkeleton } from "../ui/BenzeneSkeleton";
import { BenzeneRecord, BenzeneTab } from "../types/benzene.types";
import { DataRow } from "@/types";

export default function BenzenePage() {
    const t = useTranslations("benzene");
    const tTable = useTranslations("table.benzene");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");
    const tPages = useTranslations("pages");
    const tPrices = useTranslations("benzene.pricesTab");

    // Global date state managed here
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [activeTab, setActiveTab] = useState<BenzeneTab>("readings");

    // Pass global selectedDate to hook
    const { records, isLoading, error, addRecord, updateRecord, removeRecord } = useBenzene('shift', selectedDate);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<BenzeneRecord | null>(null);

    const columns = [
        tTable("trumbaNumber"),
        tTable("type"),
        tTable("startBalance"),
        tTable("endBalance"),
        tTable("sold"),
        tTable("price"),
        tTable("total")
    ];

    const fuelTypeDisplay: Record<string, string> = {
        "solar": tPrices("solar"),
        "ben80": tPrices("ben80"),
        "ben92": tPrices("ben92"),
        "ben95": tPrices("ben95"),
        "سولار": tPrices("solar"),
        "بنزين 80": tPrices("ben80"),
        "بنزين 92": tPrices("ben92"),
        "بنزين 95": tPrices("ben95")
    };


    const rows: DataRow[] = records.map(record => ({
        cells: [
            record.pumpNumber.toString(),
            fuelTypeDisplay[record.pumpType] || record.pumpType,
            (record.startBalance || 0).toLocaleString(),
            (record.endBalance || 0).toLocaleString(),
            (record.liters || 0).toLocaleString(),
            (record.price || 0).toLocaleString(),
            (record.totalAmount || 0).toLocaleString()
        ],
        editable: true,
        id: record.id
    }));


    const handleEdit = (index: number) => {
        setSelectedRecord(records[index]);
        setIsEditOpen(true);
    };

    const handleDelete = (index: number) => {
        setSelectedRecord(records[index]);
        setIsDeleteOpen(true);
    };

    const onAddSubmit = async (data: any) => {
        await addRecord(data);
        setIsCreateOpen(false);
    };

    const onEditSubmit = async (data: any) => {
        if (selectedRecord) {
            await updateRecord(selectedRecord.id, {
                start: data.start,
                end: data.end
            });
            setIsEditOpen(false);
        }
    };

    const onDeleteConfirm = async () => {
        if (selectedRecord) {
            await removeRecord(selectedRecord.id);
            setIsDeleteOpen(false);
        }
    };

    const tabs: { key: BenzeneTab; label: string; icon: string }[] = [
        { key: "readings", label: tPages("benzeneReadings"), icon: "bx-tachometer" },
        { key: "prices", label: tPages("benzenePrices"), icon: "bx-dollar-circle" }
    ];

    return (
        <div className="pb-10">
            <Header titleKey="benzene" />

            {/* Global Date Filter Always Visible */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                                ${activeTab === tab.key
                                    ? "bg-primary text-white shadow-md shadow-primary/25"
                                    : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                }`}
                        >
                            <i className={`bx ${tab.icon} text-lg`}></i>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{tPrices("date")}:</span>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer"
                    />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-3">
                    <i className="bx bx-error-circle text-2xl"></i>
                    <div>
                        <p className="font-bold">Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            )}

            {/* Prices Tab */}
            {activeTab === "prices" && (
                <div className="page-card">
                    <BenzenePricesTab date={selectedDate} />
                </div>
            )}

            {/* Pump Readings Tab */}
            {activeTab === "readings" && (
                <>
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="btn-primary flex items-center gap-2"
                        >
                            <i className="bx bx-plus text-lg"></i>
                            {tButtons("add")}
                        </button>
                    </div>

                    <div className="page-card">
                        {isLoading ? (
                            <BenzeneTableSkeleton />
                        ) : (
                            <DataTable
                                columns={columns}
                                rows={rows}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        )}
                        {!isLoading && records.length === 0 && !error && (
                            <div className="text-center py-20 text-slate-400">
                                <i className="bx bx-tachometer text-5xl mb-3 block"></i>
                                <p>No pump readings found for {new Date(selectedDate).toLocaleDateString()}.</p>
                            </div>
                        )}
                    </div>

                    {/* Create Modal */}
                    <Modal
                        isOpen={isCreateOpen}
                        onClose={() => setIsCreateOpen(false)}
                        title={tModals("createRecordTitle")}
                    >
                        <BenzeneForm
                            initialData={{ date: selectedDate } as any}
                            onSubmit={onAddSubmit}
                            onCancel={() => setIsCreateOpen(false)}
                        />
                    </Modal>

                    {/* Edit Modal */}
                    <Modal
                        isOpen={isEditOpen}
                        onClose={() => setIsEditOpen(false)}
                        title={tModals("editRecordTitle")}
                    >
                        <BenzeneForm
                            initialData={selectedRecord || undefined}
                            onSubmit={onEditSubmit}
                            onCancel={() => setIsEditOpen(false)}
                            isEditing
                        />
                    </Modal>

                    {/* Delete Confirmation Modal */}
                    <Modal
                        isOpen={isDeleteOpen}
                        onClose={() => setIsDeleteOpen(false)}
                        title={tModals("confirmDeleteTitle")}
                        footer={
                            <div className="flex gap-3">
                                <button className="btn-secondary" onClick={() => setIsDeleteOpen(false)}>
                                    {tButtons("cancel")}
                                </button>
                                <button className="btn-danger" onClick={onDeleteConfirm}>
                                    {tButtons("delete")}
                                </button>
                            </div>
                        }
                    >
                        <div className="flex flex-col items-center text-center py-4">
                            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4 scale-110">
                                <i className="bx bx-trash text-3xl"></i>
                            </div>
                            <p className="text-slate-600 font-medium">
                                {tModals("confirmDeleteMessage")}
                            </p>
                            {selectedRecord && (
                                <p className="mt-2 font-bold text-slate-800">
                                    {selectedRecord.pumpType} - {new Date(selectedRecord.date).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </Modal>
                </>
            )}
        </div>
    );
}
