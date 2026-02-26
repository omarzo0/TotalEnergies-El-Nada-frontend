"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { useBenzene } from "../hooks/useBenzene";
import BenzeneForm from "./forms/BenzeneForm";
import { BenzeneRecord } from "../types/benzene.types";
import { DataRow } from "@/types";

export default function BenzenePage() {
    const t = useTranslations("benzene");
    const tTable = useTranslations("table.benzene");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");

    const { records, isLoading, addRecord, updateRecord, removeRecord } = useBenzene('shift');

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<BenzeneRecord | null>(null);

    const columns = [
        tTable("type"),
        tTable("startBalance"),
        tTable("endBalance"),
        tTable("incoming"),
        tTable("sold"),
        tTable("price"),
        tTable("total"),
        tTable("date")
    ];

    const rows: DataRow[] = records.map(record => ({
        cells: [
            record.type,
            record.startBalance.toString(),
            record.endBalance.toString(),
            record.incoming.toString(),
            record.sold.toString(),
            record.price.toLocaleString(),
            record.total.toLocaleString(),
            new Date(record.date).toLocaleDateString()
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
            <Header titleKey="benzene" />

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
                <BenzeneForm
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
                            {selectedRecord.type} - {new Date(selectedRecord.date).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </Modal>
        </div>
    );
}
