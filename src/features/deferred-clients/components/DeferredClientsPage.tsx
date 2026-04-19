"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { useDeferredClients } from "../hooks/useDeferredClients";
import DeferredClientForm from "./forms/DeferredClientForm";
import { DeferredClientPayment } from "../types/deferred-clients.types";
import { DataRow } from "@/types";
import Button from "@/ui/Button";

export default function DeferredClientsPage() {
    const t = useTranslations("table.clients");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");
    const tBenzene = useTranslations("benzene");

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const { payments, dailyTotal, isLoading, addPayment, updatePayment, removePayment } = useDeferredClients(selectedDate);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [selectedPayment, setSelectedPayment] = useState<DeferredClientPayment | null>(null);

    const columns = [
        t("money") || "Money",
        t("amount") || "Amount",
        t("receiptName") || "Receipt Name",
        t("receiptNumber") || "Receipt No.",
        t("client") || "Client"
    ];

    const rows: DataRow[] = payments.map(payment => ({
        cells: [
            (payment.money || 0).toLocaleString(),
            (payment.amount || 0).toLocaleString(),
            payment.receiptName || (payment as any).sand,
            payment.receiptNumber,
            payment.clientName
        ],
        editable: true,
        id: payment._id || payment.id
    }));

    const handleEdit = (index: number) => {
        setSelectedPayment(payments[index]);
        setIsEditOpen(true);
    };

    const handleDelete = (index: number) => {
        setSelectedPayment(payments[index]);
        setIsDeleteOpen(true);
    };

    const onAddSubmit = async (data: any) => {
        await addPayment(data);
        setIsCreateOpen(false);
    };

    const onEditSubmit = async (data: any) => {
        const id = selectedPayment?._id || selectedPayment?.id;
        if (id) {
            await updatePayment(id, data);
            setIsEditOpen(false);
        }
    };

    const onDeleteConfirm = async () => {
        const id = selectedPayment?._id || selectedPayment?.id;
        if (id) {
            await removePayment(id);
            setIsDeleteOpen(false);
        }
    };

    return (
        <div className="pb-10">
            <Header titleKey="deferredClients" />

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
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
                    className="flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                    <i className="bx bx-plus text-lg"></i>
                    {tButtons("add")}
                </Button>
            </div>

            {/* Total Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-glass flex items-center justify-between group hover:border-primary/30 transition-all duration-300">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t("money") || "Total Money"}</p>
                        <h3 className="text-3xl font-black text-slate-800 tracking-tight">
                            {dailyTotal.toLocaleString()}
                            <span className="text-sm font-medium text-slate-400 ms-2">EGP</span>
                        </h3>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                        <i className="bx bx-wallet text-3xl"></i>
                    </div>
                </div>
            </div>

            <div className="page-card shadow-glass overflow-hidden">
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
                <DeferredClientForm
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
                <DeferredClientForm
                    initialData={selectedPayment || undefined}
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
                    {selectedPayment && (
                        <p className="mt-2 font-bold text-slate-800">
                            {selectedPayment.clientName} - {selectedPayment.receiptName || (selectedPayment as any).sand} ({selectedPayment.money})
                        </p>
                    )}
                </div>
            </Modal>
        </div>
    );
}
