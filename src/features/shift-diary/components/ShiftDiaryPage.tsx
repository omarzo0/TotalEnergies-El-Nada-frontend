"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { useShiftDiary } from "../hooks/useShiftDiary";
import ShiftDiaryForm from "./forms/ShiftDiaryForm";
import { ShiftRecord } from "../types/shift-diary.types";
import { DataRow } from "@/types";

export default function ShiftDiaryPage() {
    const tHeader = useTranslations("table.shiftDiary");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");

    const { shifts, isLoading, addShift, editShift, removeShift } = useShiftDiary();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<ShiftRecord | null>(null);

    const columns = [
        tHeader("pumpNumber"),
        tHeader("type"),
        tHeader("start"),
        tHeader("end"),
        tHeader("total"),
        tHeader("priceDiff"),
        tHeader("transfer"),
        tHeader("creditor"),
        tHeader("debtor"),
        tHeader("description")
    ];

    const rows: DataRow[] = shifts.map(record => ({
        cells: [
            record.pump,
            record.type,
            record.start,
            record.end,
            record.total,
            record.priceDiff,
            record.transfer,
            record.creditor,
            record.debtor,
            record.description
        ],
        editable: true
    }));

    const handleEdit = (index: number) => {
        setSelectedRecord(shifts[index]);
        setIsEditOpen(true);
    };

    const handleDelete = (index: number) => {
        setSelectedRecord(shifts[index]);
        setIsDeleteOpen(true);
    };

    const onAddSubmit = async (data: any) => {
        // Calculate total locally for the PoC
        const total = (parseFloat(data.end) - parseFloat(data.start)).toString();
        await addShift({ ...data, total });
        setIsCreateOpen(false);
    };

    const onEditSubmit = async (data: any) => {
        if (selectedRecord) {
            const total = (parseFloat(data.end) - parseFloat(data.start)).toString();
            await editShift(selectedRecord.pump, { ...data, total });
            setIsEditOpen(false);
        }
    };

    const onDeleteConfirm = async () => {
        if (selectedRecord) {
            await removeShift(selectedRecord.pump);
            setIsDeleteOpen(false);
        }
    };

    return (
        <div className="pb-10">
            <Header titleKey="shiftDiary" />

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
                <ShiftDiaryForm
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
                <ShiftDiaryForm
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
                            {tHeader("pumpNumber")}: {selectedRecord.pump} ({selectedRecord.type})
                        </p>
                    )}
                </div>
            </Modal>
        </div>
    );
}
