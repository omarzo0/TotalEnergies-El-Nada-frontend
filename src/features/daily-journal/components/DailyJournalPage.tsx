"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { useDailyJournal } from "../hooks/useDailyJournal";
import DailyJournalForm from "./forms/DailyJournalForm";
import { DailyJournalRecord } from "../types/daily-journal.types";
import { DataRow } from "@/types";

export default function DailyJournalPage() {
    const t = useTranslations("table.dailyJournal");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");

    const { records, isLoading, addRecord, updateRecord, removeRecord } = useDailyJournal();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<DailyJournalRecord | null>(null);

    const columns = [t("priceDiff"), t("transfer"), t("description"), t("creditor"), t("debtor")];

    const rows: DataRow[] = records.map(r => ({
        cells: [r.priceDiff, r.transfer, r.description, r.creditor, r.debtor],
        editable: true,
        id: r.id
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
            <Header titleKey="dailyJournal" />

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
                <DailyJournalForm
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
                <DailyJournalForm
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
