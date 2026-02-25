"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { useSupplyBookRecords } from "../hooks/useSupplyBookRecords";
import SupplyBookForm from "./forms/SupplyBookForm";
import { SupplyBookRecord } from "../types/supply-book.types";
import { DataRow, TabItem } from "@/types";

export default function SupplyBookRecordsPage() {
    const t = useTranslations("table.supplyBook");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");
    const pathname = usePathname();

    const { records, isLoading, addRecord, updateRecord, removeRecord } = useSupplyBookRecords();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<SupplyBookRecord | null>(null);

    const tabs: TabItem[] = [
        { href: "/supply-book/records", labelKey: "supplyBook", active: pathname === "/supply-book/records" },
        { href: "/supply-book/balance-matching", labelKey: "balanceMatching", active: pathname === "/supply-book/balance-matching" },
    ];

    const columns = [t("standard"), t("end"), t("start"), t("pumps"), t("dispensed"), t("incoming"), t("date")];

    const rows: DataRow[] = records.map(record => ({
        cells: [record.standard, record.end, record.start, record.pumps, record.dispensed, record.incoming, record.date],
        editable: true,
        id: record.id
    }));

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
            await updateRecord(selectedRecord.id, data);
            setIsEditOpen(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (selectedRecord) {
            await removeRecord(selectedRecord.id);
            setIsDeleteOpen(false);
        }
    };

    return (
        <div className="pb-10">
            <Header titleKey="supplyBook" tabs={tabs} />

            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="btn-primary flex items-center gap-2 shadow-sm"
                >
                    <i className="bx bx-plus text-lg"></i>
                    {tButtons("add")}
                </button>
            </div>

            <div className="page-card shadow-glass">
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
            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title={tModals("createRecordTitle")}
            >
                <SupplyBookForm
                    onSubmit={handleCreateSubmit}
                    onCancel={() => setIsCreateOpen(false)}
                />
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title={tModals("editRecordTitle")}
            >
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
                        <button className="btn-secondary" onClick={() => setIsDeleteOpen(false)}>
                            {tButtons("cancel")}
                        </button>
                        <button className="btn-danger" onClick={handleDeleteConfirm}>
                            {tButtons("delete")}
                        </button>
                    </div>
                }
            >
                <p>{tModals("confirmDeleteMessage")}</p>
            </Modal>
        </div>
    );
}
