"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { useSupplyBookRecords } from "../hooks/useSupplyBookRecords";
import SupplyBookForm from "./forms/SupplyBookForm";
import { SupplyBookRecord, FUEL_TYPES } from "../types/supply-book.types";
import { DataRow, TabItem } from "@/types";
import Button from "@/ui/Button";

export default function SupplyBookRecordsPage() {
    const t = useTranslations("table.supplyBook");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");
    const tBenzene = useTranslations("benzene");
    const tFuel = useTranslations("fuelTypes");
    const pathname = usePathname();

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [benzTypeFilter, setBenzTypeFilter] = useState<string>("");

    const { records, isLoading, addRecord, updateRecord, removeRecord } = useSupplyBookRecords(
        selectedDate,
        benzTypeFilter || undefined
    );

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<SupplyBookRecord | null>(null);

    const tabs: TabItem[] = [
        { href: "/supply-book/records", labelKey: "supplyBook", active: pathname === "/supply-book/records" },
        { href: "/supply-book/balance-matching", labelKey: "balanceMatching", active: pathname === "/supply-book/balance-matching" },
    ];

    const columns = [
        t("benzType") || "Fuel Type",
        t("start"),
        t("incoming"),
        t("dispensed"),
        t("pumps"),
        t("end"),
        t("standard")
    ];

    const rows: DataRow[] = records.map(record => ({
        cells: [
            record.benzType,
            (record.start || 0).toLocaleString(),
            (record.incoming || 0).toLocaleString(),
            (record.dispensed || 0).toLocaleString(),
            record.pumps || "—",
            (record.end || 0).toLocaleString(),
            (record.standard || 0).toLocaleString()
        ],
        editable: true,
        id: record._id || record.id
    }));

    const fuelFilterOptions = [
        { value: "", label: tFuel("all") || "All Types" },
        { value: FUEL_TYPES.SOLAR, label: tFuel("diesel") },
        { value: FUEL_TYPES.B80, label: tFuel("gasoline80") },
        { value: FUEL_TYPES.B92, label: tFuel("gasoline92") },
        { value: FUEL_TYPES.B95, label: tFuel("gasoline95") },
    ];

    const handleEdit = (index: number) => {
        setSelectedRecord(records[index]);
        setIsEditOpen(true);
    };

    const onDelete = (index: number) => {
        setSelectedRecord(records[index]);
        setIsDeleteOpen(true);
    };

    const handleCreateSubmit = async (data: any) => {
        await addRecord(data);
        setIsCreateOpen(false);
    };

    const handleEditSubmit = async (data: any) => {
        if (selectedRecord) {
            await updateRecord({
                ...selectedRecord,
                ...data,
                date: selectedRecord.date || selectedDate
            });
            setIsEditOpen(false);
        }
    };

    const handleDeleteConfirm = async () => {
        const id = selectedRecord?._id || selectedRecord?.id;
        if (id) {
            await removeRecord(id);
            setIsDeleteOpen(false);
        }
    };

    return (
        <div className="pb-10">
            <Header titleKey="supplyBook" tabs={tabs} />

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm h-[42px]">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{tBenzene("pricesTab.date")}:</span>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer"
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm h-[42px]">
                        <i className="bx bx-filter text-slate-400"></i>
                        <select
                            value={benzTypeFilter}
                            onChange={(e) => setBenzTypeFilter(e.target.value)}
                            className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer"
                        >
                            {fuelFilterOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <Button
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                    <i className="bx bx-plus text-lg"></i>
                    {tButtons("add")}
                </Button>
            </div>

            <div className="page-card shadow-glass overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        rows={rows}
                        onEdit={handleEdit}
                        onDelete={onDelete}
                    />
                )}
            </div>

            {/* Create Modal */}
            <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title={tModals("createRecordTitle")}>
                <SupplyBookForm
                    onSubmit={handleCreateSubmit}
                    onCancel={() => setIsCreateOpen(false)}
                />
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title={tModals("editRecordTitle")}>
                <SupplyBookForm
                    initialData={selectedRecord || undefined}
                    onSubmit={handleEditSubmit}
                    onCancel={() => setIsEditOpen(false)}
                    isEditing
                />
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                title={tModals("confirmDeleteTitle")}
                footer={
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={() => setIsDeleteOpen(false)}>
                            {tButtons("cancel")}
                        </Button>
                        <Button variant="danger" onClick={handleDeleteConfirm}>
                            {tButtons("delete")}
                        </Button>
                    </div>
                }
            >
                <div className="flex flex-col items-center text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4 scale-110">
                        <i className="bx bx-trash text-3xl"></i>
                    </div>
                    <p className="text-slate-600 font-medium">{tModals("confirmDeleteMessage")}</p>
                    {selectedRecord && (
                        <p className="mt-2 font-bold text-slate-800">
                            {selectedRecord.benzType} — {selectedRecord.date}
                        </p>
                    )}
                </div>
            </Modal>
        </div>
    );
}
