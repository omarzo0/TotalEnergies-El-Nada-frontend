"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { useTreasuryMovement } from "../hooks/useTreasuryMovement";
import TreasuryTransactionForm from "./forms/TreasuryTransactionForm";
import { TreasuryTransaction } from "../types/treasury-movement.types";
import { DataRow, TabItem } from "@/types";

export default function TreasuryMovementTransactionsPage() {
    const t = useTranslations("table.treasuryMovement");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");
    const pathname = usePathname();

    const { transactions, isLoading, addTransaction, updateTransaction, removeTransaction } = useTreasuryMovement();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<TreasuryTransaction | null>(null);

    const tabs: TabItem[] = [
        { href: "/treasury-movement/transactions", labelKey: "treasuryMovement", active: pathname === "/treasury-movement/transactions" },
        { href: "/treasury-movement/accounts", labelKey: "accounts", active: pathname === "/treasury-movement/accounts" },
    ];

    const columns = [t("amount"), t("receipt"), t("description")];

    const rows: DataRow[] = transactions.map(t => ({
        cells: [t.amount, t.receipt, t.description],
        editable: true,
        id: t.id
    }));

    const handleEdit = (index: number) => {
        setSelectedRecord(transactions[index]);
        setIsEditOpen(true);
    };

    const onDelete = (index: number) => {
        setSelectedRecord(transactions[index]);
        setIsDeleteOpen(true);
    };

    const handleCreateSubmit = async (data: any) => {
        await addTransaction(data);
        setIsCreateOpen(false);
    };

    const handleEditSubmit = async (data: any) => {
        if (selectedRecord) {
            await updateTransaction(selectedRecord.id, data);
            setIsEditOpen(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (selectedRecord) {
            await removeTransaction(selectedRecord.id);
            setIsDeleteOpen(false);
        }
    };

    return (
        <div className="pb-10">
            <Header titleKey="treasuryMovement" tabs={tabs} />

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
                <TreasuryTransactionForm
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
                <TreasuryTransactionForm
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
