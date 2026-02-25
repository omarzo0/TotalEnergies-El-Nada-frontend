"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { useTreasuryAccounts } from "../hooks/useTreasuryAccounts";
import TreasuryAccountForm from "./forms/TreasuryAccountForm";
import { TreasuryAccount } from "../types/treasury-movement.types";
import { DataRow, TabItem } from "@/types";

export default function TreasuryMovementAccountsPage() {
    const t = useTranslations("table.accounts");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");
    const pathname = usePathname();

    const { accounts, isLoading, addAccount, updateAccount, removeAccount } = useTreasuryAccounts();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<TreasuryAccount | null>(null);

    const tabs: TabItem[] = [
        { href: "/treasury-movement/transactions", labelKey: "treasuryMovement", active: false },
        { href: "/treasury-movement/accounts", labelKey: "accounts", active: pathname === "/treasury-movement/accounts" },
    ];

    const columns = [t("receipt"), t("amount")];

    const rows: DataRow[] = accounts.map(a => ({
        cells: [a.receipt, a.amount],
        editable: true,
        id: a.id
    }));

    const handleEdit = (index: number) => {
        setSelectedRecord(accounts[index]);
        setIsEditOpen(true);
    };

    const onDelete = (index: number) => {
        setSelectedRecord(accounts[index]);
        setIsDeleteOpen(true);
    };

    const handleCreateSubmit = async (data: any) => {
        await addAccount(data);
        setIsCreateOpen(false);
    };

    const handleEditSubmit = async (data: any) => {
        if (selectedRecord) {
            await updateAccount(selectedRecord.id, data);
            setIsEditOpen(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (selectedRecord) {
            await removeAccount(selectedRecord.id);
            setIsDeleteOpen(false);
        }
    };

    return (
        <div className="pb-10">
            <Header titleKey="accounts" tabs={tabs} />

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
                <TreasuryAccountForm
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
                <TreasuryAccountForm
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
