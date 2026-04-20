"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { useExpenses } from "../hooks/useExpenses";
import ExpenseForm from "./forms/ExpenseForm";
import { Expense } from "../types/expenses.types";
import { DataRow } from "@/types";
import { ExpensesTableSkeleton } from "../ui/ExpensesSkeleton";
import Button from "@/ui/Button";

export default function ExpensesPage() {
    const t = useTranslations("table.expenses");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");
    const tBenzene = useTranslations("benzene"); // For the date label

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const { expenses, isLoading, addExpense, updateExpense, removeExpense } = useExpenses(selectedDate);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

    const columns = [t("receiptName") || "Receipt Name", t("amount") || "Amount"];

    const rows: DataRow[] = expenses.map(expense => ({
        cells: [expense.receiptName, (expense.money || 0).toLocaleString()],
        editable: true,
        id: expense._id || expense.id
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
        const id = selectedExpense?._id || selectedExpense?.id;
        if (id) {
            await updateExpense(id, data);
            setIsEditOpen(false);
        }
    };

    const onDeleteConfirm = async () => {
        const id = selectedExpense?._id || selectedExpense?.id;
        if (id) {
            await removeExpense(id);
            setIsDeleteOpen(false);
        }
    };

    return (
        <div className="pb-10">
            <Header titleKey="expenses" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm h-[42px]">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{tBenzene("pricesTab.date")}:</span>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer"
                    />
                </div>

                <Button
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-2 shadow-sm"
                >
                    <i className="bx bx-plus text-lg"></i>
                    {tButtons("add")}
                </Button>
            </div>

            <div className="page-card shadow-glass">
                {isLoading ? (
                    <ExpensesTableSkeleton />
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
                        <Button variant="secondary" onClick={() => setIsDeleteOpen(false)}>
                            {tButtons("cancel")}
                        </Button>
                        <Button variant="danger" onClick={onDeleteConfirm}>
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
                    {selectedExpense && (
                        <p className="mt-2 font-bold text-slate-800">
                            {selectedExpense.receiptName} ({selectedExpense.money})
                        </p>
                    )}
                </div>
            </Modal>
        </div>
    );
}
