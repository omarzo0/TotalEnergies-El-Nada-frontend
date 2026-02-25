"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { useExpenses } from "../hooks/useExpenses";
import ExpenseForm from "./forms/ExpenseForm";
import { ExpenseRecord } from "../types/expenses.types";
import { DataRow } from "@/types";

export default function ExpensesPage() {
    const t = useTranslations("table.expenses");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");

    const { expenses, isLoading, addExpense, updateExpense, removeExpense } = useExpenses();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [selectedExpense, setSelectedExpense] = useState<ExpenseRecord | null>(null);

    const columns = [t("amount"), t("receipt")];

    const rows: DataRow[] = expenses.map(expense => ({
        cells: [expense.amount, expense.receipt],
        editable: true,
        id: expense.id || (Math.random() * 1000).toString() // Fallback if id is missing in mock data
    }));

    const handleEdit = (index: number) => {
        setSelectedExpense(expenses[index]);
        setIsEditOpen(true);
    };

    const handleDelete = (index: number) => {
        setSelectedExpense(expenses[index]);
        setIsDeleteOpen(true);
    };

    const onAddSubmit = async (data: any) => {
        await addExpense(data);
        setIsCreateOpen(false);
    };

    const onEditSubmit = async (data: any) => {
        if (selectedExpense && (selectedExpense.id || selectedExpense.receipt)) {
            const id = selectedExpense.id || selectedExpense.receipt; // Using receipt as fallback for mock
            await updateExpense(id, data);
            setIsEditOpen(false);
        }
    };

    const onDeleteConfirm = async () => {
        if (selectedExpense && (selectedExpense.id || selectedExpense.receipt)) {
            const id = selectedExpense.id || selectedExpense.receipt;
            await removeExpense(id);
            setIsDeleteOpen(false);
        }
    };

    return (
        <div className="pb-10">
            <Header titleKey="expenses" />

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
                <ExpenseForm
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
                <ExpenseForm
                    initialData={selectedExpense || undefined}
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
                    {selectedExpense && (
                        <p className="mt-2 font-bold text-slate-800">
                            {selectedExpense.receipt} ({selectedExpense.amount})
                        </p>
                    )}
                </div>
            </Modal>
        </div>
    );
}
