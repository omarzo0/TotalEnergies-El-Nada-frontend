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
import { DeferredClientsSummarySkeleton, DeferredClientsTableSkeleton } from "../ui/DeferredClientsSkeleton";
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
        t("receiptName") || "Receipt Name",
        t("receiptNumber") || "Receipt No.",
        t("client") || "Client"
    ];


    const rows: DataRow[] = payments.map(payment => ({
        cells: [
            (payment.money || 0).toLocaleString(),
            payment.receiptName,
            payment.receiptNumber || "—",
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

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Date Picker */}
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm h-[48px]">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{tBenzene("pricesTab.date")}:</span>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer"
                        />
                    </div>

                    {/* Compact Total Card */}
                    {isLoading ? (
                        <div className="h-[48px] w-32 bg-slate-200/50 animate-pulse rounded-xl border border-slate-200" />
                    ) : (
                        <div className="flex items-center gap-4 bg-white px-5 py-2 rounded-xl border border-slate-200 shadow-sm h-[48px] border-l-4 border-l-primary">
                            <div className="flex flex-col justify-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{t("money") || "Total"}</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-lg font-black text-slate-800 leading-none">{dailyTotal.toLocaleString()}</span>
                                    <span className="text-[10px] font-bold text-slate-400">EGP</span>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <i className="bx bx-wallet text-lg"></i>
                            </div>
                        </div>
                    )}
                </div>

                <Button
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-2 shadow-lg shadow-primary/20 h-[48px] !px-6"
                >
                    <i className="bx bx-plus text-lg"></i>
                    {tButtons("add")}
                </Button>
            </div>

            <div className="page-card shadow-glass overflow-hidden">
                {isLoading ? (
                    <DeferredClientsTableSkeleton />
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
                            {selectedPayment.clientName} - {selectedPayment.receiptName} ({selectedPayment.money})
                        </p>
                    )}
                </div>
            </Modal>
        </div>
    );
}
