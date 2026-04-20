"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { useVouchers } from "../hooks/useVouchers";
import VoucherForm from "./forms/VoucherForm";
import { VoucherRecord } from "../types/vouchers.types";
import { DataRow, TabItem } from "@/types";
import { VoucherListSkeleton } from "../ui/VoucherSkeleton";

export default function VouchersListPage() {
    const t = useTranslations("table.vouchers");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");
    const tPrices = useTranslations("benzene.pricesTab");
    const pathname = usePathname();

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const { vouchers, isLoading, addVoucher, updateVoucher, removeVoucher, error } = useVouchers(selectedDate, undefined, undefined, { fetchVouchers: true, fetchMatching: false });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [selectedVoucher, setSelectedVoucher] = useState<VoucherRecord | null>(null);

    const tabs: TabItem[] = [
        { href: "/vouchers/list", labelKey: "vouchers", active: pathname === "/vouchers/list" },
        { href: "/vouchers/matching", labelKey: "voucherMatching", active: pathname === "/vouchers/matching" },
    ];

    const columns = [
        t("entity"),
        t("serial"),
        t("total"),
        t("liters"),
        t("price"),
        t("pumpType")
    ];


    const rows: DataRow[] = vouchers.map(voucher => ({
        cells: [
            voucher.side,
            voucher.voucherSerial,
            (voucher.total ?? 0).toLocaleString(),
            (voucher.liters ?? 0).toString(),
            (voucher.price ?? 0).toLocaleString(),
            voucher.pumpType
        ],
        editable: true,
        id: voucher.id
    }));



    const handleEdit = (index: number) => {
        setSelectedVoucher(vouchers[index]);
        setIsEditOpen(true);
    };

    const handleDelete = (index: number) => {
        setSelectedVoucher(vouchers[index]);
        setIsDeleteOpen(true);
    };

    const onAddSubmit = async (data: any) => {
        await addVoucher(data);
        setIsCreateOpen(false);
    };

    const onEditSubmit = async (data: any) => {
        if (selectedVoucher && selectedVoucher.id) {
            await updateVoucher(selectedVoucher.id, data);
            setIsEditOpen(false);
        }
    };

    const onDeleteConfirm = async () => {
        if (selectedVoucher && selectedVoucher.id) {
            await removeVoucher(selectedVoucher.id);
            setIsDeleteOpen(false);
        }
    };

    return (
        <div className="pb-10">
            <Header titleKey="vouchers" tabs={tabs} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{tPrices("date")}:</span>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer"
                    />
                </div>

                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="btn-primary flex items-center gap-2 shadow-sm"
                >
                    <i className="bx bx-plus text-lg"></i>
                    {tButtons("add")}
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-3">
                    <i className="bx bx-error-circle text-2xl"></i>
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <div className="page-card shadow-glass">
                {isLoading ? (
                    <VoucherListSkeleton />
                ) : (
                    <>
                        <DataTable
                            columns={columns}
                            rows={rows}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                        {vouchers.length === 0 && (
                            <div className="text-center py-20 text-slate-400">
                                <i className="bx bx-receipt text-5xl mb-3 block"></i>
                                <p>No vouchers found for this date.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title={tModals("createRecordTitle")}
            >
                <VoucherForm
                    initialData={{ date: selectedDate } as any}
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
                <VoucherForm
                    initialData={selectedVoucher || undefined}
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
                    {selectedVoucher && (
                        <p className="mt-2 font-bold text-slate-800">
                            {selectedVoucher.voucherSerial} - {selectedVoucher.side}
                        </p>
                    )}
                </div>
            </Modal>
        </div>
    );
}


