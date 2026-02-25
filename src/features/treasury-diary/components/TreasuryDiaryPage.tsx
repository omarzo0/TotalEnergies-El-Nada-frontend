"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import TreasuryDiaryForm from "./forms/TreasuryDiaryForm";
import { useTreasuryDiary } from "../hooks/useTreasuryDiary";
import { TreasuryRecord } from "../types/treasury-diary.types";
import { DataRow } from "@/types";

export default function TreasuryDiaryPage() {
    const t = useTranslations("table.treasuryDiary");
    const tItems = useTranslations("treasuryItems");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");
    const { records, isLoading, addRecord, updateRecord, removeRecord } = useTreasuryDiary();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [selectedRecord, setSelectedRecord] = useState<TreasuryRecord | null>(null);

    const columns = [t("amount"), t("price"), t("quantity"), t("description")];

    const rows: DataRow[] = records.map(record => ({
        cells: [record.amount, record.price, record.quantity, record.labelKey.includes('.') ? record.labelKey : tItems(record.labelKey)],
        editable: record.isEditable,
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
            await updateRecord(selectedRecord.id, data);
            setIsEditOpen(false);
        }
    };

    const onDeleteConfirm = async () => {
        if (selectedRecord) {
            await removeRecord(selectedRecord.id);
            setIsDeleteOpen(false);
        }
    };

    return (
        <div className="pb-10">
            <Header titleKey="treasuryDiary" />

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
                        onDelete={handleDelete}
                    />
                )}
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title={tModals("createRecordTitle")}
            >
                <TreasuryDiaryForm
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
                <TreasuryDiaryForm
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
                            {selectedRecord.labelKey.includes('.') ? selectedRecord.labelKey : tItems(selectedRecord.labelKey)} ({selectedRecord.amount})
                        </p>
                    )}
                </div>
            </Modal>
        </div>
    );
}
