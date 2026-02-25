"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import Image from "next/image";
import { useVouchers } from "../hooks/useVouchers";
import VoucherForm from "./forms/VoucherForm";
import { VoucherRecord } from "../types/vouchers.types";
import { DataRow, TabItem } from "@/types";

export default function VouchersListPage() {
    const t = useTranslations("table.vouchers");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");
    const pathname = usePathname();

    const { vouchers, isLoading, fetchVouchers, addVoucher, updateVoucher, removeVoucher } = useVouchers();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isImageOpen, setIsImageOpen] = useState(false);

    const [selectedVoucher, setSelectedVoucher] = useState<VoucherRecord | null>(null);

    useEffect(() => {
        fetchVouchers();
    }, [fetchVouchers]);

    const tabs: TabItem[] = [
        { href: "/vouchers/list", labelKey: "vouchers", active: pathname === "/vouchers/list" },
        { href: "/vouchers/matching", labelKey: "voucherMatching", active: pathname === "/vouchers/matching" },
    ];

    const columns = [t("entity"), t("serial"), t("total"), t("category"), t("price"), t("image")];

    const rows: DataRow[] = vouchers.map(voucher => ({
        cells: [voucher.entity, voucher.serial, voucher.total, voucher.category, voucher.price, voucher.image],
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

    const handleImageClick = (url: string) => {
        const voucher = vouchers.find(v => v.image === url);
        if (voucher) {
            setSelectedVoucher(voucher);
            setIsImageOpen(true);
        }
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
                        onImageClick={handleImageClick}
                    />
                )}
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title={tModals("createRecordTitle")}
            >
                <VoucherForm
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

            {/* Image Preview Modal */}
            <Modal
                isOpen={isImageOpen}
                onClose={() => setIsImageOpen(false)}
                title={tModals("imagePreviewTitle") || "Image Preview"}
                maxWidth="max-w-4xl"
            >
                {selectedVoucher && (
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 group shadow-inner border border-slate-200/50">
                        <Image
                            src={selectedVoucher.image}
                            alt="Receipt Preview"
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </div>
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
                    {selectedVoucher && (
                        <p className="mt-2 font-bold text-slate-800">
                            {selectedVoucher.serial} - {selectedVoucher.entity}
                        </p>
                    )}
                </div>
            </Modal>
        </div>
    );
}
