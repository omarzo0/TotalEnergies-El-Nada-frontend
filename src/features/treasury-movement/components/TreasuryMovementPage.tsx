"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { useTreasuryMovement } from "../hooks/useTreasuryMovement";
import { useAccounts } from "../hooks/useAccounts";
import TreasuryMovementForm from "./forms/TreasuryMovementForm";
import AccountForm from "./forms/AccountForm";
import { TreasuryMovement, TreasuryMovementType, Account } from "../types/treasury-movement.types";
import { DataRow, TabItem } from "@/types";
import { Input, Select } from "@/ui/Input";
import { TreasuryMovementTableSkeleton, AccountsTableSkeleton } from "../ui/TreasuryMovementSkeleton";

type TabType = 'movements' | 'accounts';

export default function TreasuryMovementPage() {
    const t = useTranslations("treasuryMovement");
    const tLabels = useTranslations("labels");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");

    // Unified Date state
    const [activeTab, setActiveTab] = useState<TabType>('movements');
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    // Movement Filter state
    const [movType, setMovType] = useState<TreasuryMovementType>('all');
    const [movStatement, setMovStatement] = useState("");

    // Accounts Filter state
    const [accName, setAccName] = useState("");

    // Hooks
    const movHook = useTreasuryMovement(
        { date, type: movType, statement: movStatement },
        { enabled: activeTab === 'movements' }
    );
    const accHook = useAccounts(
        { date, name: accName },
        { enabled: activeTab === 'accounts' }
    );

    // Modals state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedMovement, setSelectedMovement] = useState<TreasuryMovement | null>(null);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    const handleFilterChange = () => {
        if (activeTab === 'movements') {
            movHook.setFilters({ date, type: movType, statement: movStatement });
        } else {
            accHook.setFilters({ date, name: accName });
        }
    };

    const tabs: TabItem[] = [
        { labelKey: "treasuryMovement", href: "#movements", active: activeTab === 'movements', onClick: () => setActiveTab('movements') },
        { labelKey: "accounts", href: "#accounts", active: activeTab === 'accounts', onClick: () => setActiveTab('accounts') },
    ];

    // Table Setup based on Tab
    const movColumns = [t("type"), t("statement"), t("receiptName"), t("money"), t("description")];
    const accColumns = [tLabels("name"), t("receiptName"), t("money")];

    const movRows: DataRow[] = movHook.movements.map(m => ({
        cells: [
            m.type === "مقبوضات" ? t("income") : t("expense"),
            m.statement || "-",
            m.receiptName || "-",
            (m.money ?? 0).toLocaleString(),
            m.description || "-"
        ],
        editable: true,
        id: m.id || m._id
    }));

    const accRows: DataRow[] = accHook.accounts.map(a => ({
        cells: [
            a.name,
            a.receiptName,
            (a.money ?? 0).toLocaleString()
        ],
        editable: true,
        id: a.id || a._id
    }));

    const handleEdit = (index: number) => {
        if (activeTab === 'movements') {
            setSelectedMovement(movHook.movements[index]);
        } else {
            setSelectedAccount(accHook.accounts[index]);
        }
        setIsEditOpen(true);
    };

    const handleDelete = (index: number) => {
        if (activeTab === 'movements') {
            setSelectedMovement(movHook.movements[index]);
        } else {
            setSelectedAccount(accHook.accounts[index]);
        }
        setIsDeleteOpen(true);
    };

    const onAddSubmit = async (data: any) => {
        if (activeTab === 'movements') {
            await movHook.addMovement(data);
        } else {
            await accHook.addAccount(data);
        }
        setIsCreateOpen(false);
    };

    const onEditSubmit = async (data: any) => {
        if (activeTab === 'movements' && selectedMovement) {
            await movHook.updateMovement(selectedMovement.id || selectedMovement._id!, data);
        } else if (activeTab === 'accounts' && selectedAccount) {
            await accHook.updateAccount(selectedAccount.id || selectedAccount._id!, data);
        }
        setIsEditOpen(false);
    };

    const onDeleteConfirm = async () => {
        if (activeTab === 'movements' && selectedMovement) {
            await movHook.removeMovement(selectedMovement.id || selectedMovement._id!);
        } else if (activeTab === 'accounts' && selectedAccount) {
            await accHook.removeAccount(selectedAccount.id || selectedAccount._id!);
        }
        setIsDeleteOpen(false);
    };

    const typeOptions = [
        { value: "all", label: t("type") + ": " + (t("income") + "/" + t("expense")) },
        { value: "مقبوضات", label: t("income") },
        { value: "مدفوعات", label: t("expense") },
    ];

    return (
        <div className="pb-10">
            <Header titleKey="treasuryMovement" tabs={tabs} />

            {/* Filters Section */}
            <div className="page-card mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <Input
                        label={t("date")}
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />

                    {activeTab === 'movements' ? (
                        <>
                            <Select
                                label={t("type")}
                                value={movType}
                                onChange={(e) => setMovType(e.target.value as TreasuryMovementType)}
                                options={typeOptions}
                            />
                            <Input
                                label={t("statement")}
                                value={movStatement}
                                onChange={(e) => setMovStatement(e.target.value)}
                                placeholder="..."
                            />
                        </>
                    ) : (
                        <>
                            <Input
                                label={tLabels("name")}
                                value={accName}
                                onChange={(e) => setAccName(e.target.value)}
                                placeholder="..."
                            />
                            <div className="hidden md:block"></div>
                        </>
                    )}

                    <button
                        onClick={handleFilterChange}
                        className="btn-primary h-[42px] flex items-center justify-center gap-2"
                    >
                        <i className="bx bx-search text-lg"></i>
                        Filter
                    </button>
                </div>
            </div>

            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <i className="bx bx-plus text-lg"></i>
                    {tButtons("add")}
                </button>
            </div>

            {/* Table Section */}
            <div className="page-card">
                {(movHook.error || accHook.error) && (
                    <div className="p-4 mb-6 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-3">
                        <i className="bx bx-error-circle text-2xl"></i>
                        <p>{movHook.error || accHook.error}</p>
                    </div>
                )}

                {(activeTab === 'movements' ? movHook.isLoading : accHook.isLoading) ? (
                    activeTab === 'movements' ? <TreasuryMovementTableSkeleton /> : <AccountsTableSkeleton />
                ) : (
                    <DataTable
                        columns={activeTab === 'movements' ? movColumns : accColumns}
                        rows={activeTab === 'movements' ? movRows : accRows}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}

                {activeTab === 'movements' && !movHook.isLoading && movHook.movements.length === 0 && !movHook.error && (
                    <div className="text-center py-20 text-slate-400">
                        <i className="bx bx-transfer-alt text-5xl mb-3 block"></i>
                        <p>No movements found for these filters.</p>
                    </div>
                )}

                {activeTab === 'accounts' && !accHook.isLoading && accHook.accounts.length === 0 && !accHook.error && (
                    <div className="text-center py-20 text-slate-400">
                        <i className="bx bx-user text-5xl mb-3 block"></i>
                        <p>No account entries found for these filters.</p>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title={tModals("createRecordTitle")}
            >
                {activeTab === 'movements' ? (
                    <TreasuryMovementForm
                        selectedDate={date}
                        onSubmit={onAddSubmit}
                        onCancel={() => setIsCreateOpen(false)}
                    />
                ) : (
                    <AccountForm
                        selectedDate={date}
                        onSubmit={onAddSubmit}
                        onCancel={() => setIsCreateOpen(false)}
                    />
                )}
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title={tModals("editRecordTitle")}
            >
                {activeTab === 'movements' ? (
                    <TreasuryMovementForm
                        initialData={selectedMovement || undefined}
                        selectedDate={date}
                        onSubmit={onEditSubmit}
                        onCancel={() => setIsEditOpen(false)}
                        isEditing
                    />
                ) : (
                    <AccountForm
                        initialData={selectedAccount || undefined}
                        selectedDate={date}
                        onSubmit={onEditSubmit}
                        onCancel={() => setIsEditOpen(false)}
                        isEditing
                    />
                )}
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
                    {activeTab === 'movements' && selectedMovement && (
                        <p className="mt-2 font-bold text-slate-800">
                            {selectedMovement.statement} - {selectedMovement.money.toLocaleString()}
                        </p>
                    )}
                    {activeTab === 'accounts' && selectedAccount && (
                        <p className="mt-2 font-bold text-slate-800">
                            {selectedAccount.name} - {selectedAccount.money.toLocaleString()}
                        </p>
                    )}
                </div>
            </Modal>
        </div>
    );
}
