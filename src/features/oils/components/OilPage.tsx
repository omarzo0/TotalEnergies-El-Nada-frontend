"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import Image from "next/image";
import { useOils } from "../hooks/useOils";
import OilForm from "./forms/OilForm";
import { OilRecord, OilRecordType } from "../types/oils.types";
import { DataRow, TabItem } from "@/types";

interface OilPageProps {
    type: OilRecordType;
}

export default function OilPage({ type }: OilPageProps) {
    const t = useTranslations("table.oils");
    const tStorage = useTranslations("table.oilStorage");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");
    const pathname = usePathname();

    const { records, isLoading, addRecord, updateRecord, removeRecord } = useOils(type);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isImageOpen, setIsImageOpen] = useState(false);

    const [selectedRecord, setSelectedRecord] = useState<OilRecord | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const tabs: TabItem[] = [
        { href: "/oils/shift", labelKey: "oilShift", active: type === 'shift' },
        { href: "/oils/storage", labelKey: "oilStorage", active: type === 'storage' },
    ];

    const columns = type === 'shift'
        ? [t("oilType"), t("startBalance"), t("endBalance"), t("incoming"), t("sold"), t("image")]
        : [t("oilType"), t("startBalance"), t("endBalance"), tStorage("storageIncoming"), t("image")];

    const rows: DataRow[] = records.map(record => ({
        cells: type === 'shift'
            ? [record.oilType, record.startBalance, record.endBalance, record.incoming, record.sold || "0", record.image]
            : [record.oilType, record.startBalance, record.endBalance, record.incoming, record.image],
        editable: true
    }));

    const handleEdit = (index: number) => {
        setSelectedRecord(records[index]);
        setIsEditOpen(true);
    };

    const handleDelete = (index: number) => {
        setSelectedRecord(records[index]);
        setIsDeleteOpen(true);
    };

    const handleImageClick = (url: string) => {
        setSelectedImage(url);
        setIsImageOpen(true);
    };

    const onAddSubmit = async (data: any) => {
        await addRecord(data);
        setIsCreateOpen(false);
    };

    const onEditSubmit = async (data: any) => {
        if (selectedRecord) {
            await updateRecord(selectedRecord.oilType, data);
            setIsEditOpen(false);
        }
    };

    const onDeleteConfirm = async () => {
        if (selectedRecord) {
            await removeRecord(selectedRecord.oilType);
            setIsDeleteOpen(false);
        }
    };

    return (
        <div className="pb-10">
            <Header titleKey={type === 'shift' ? "oilShift" : "oilStorage"} tabs={tabs} />

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
                <OilForm
                    type={type}
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
                <OilForm
                    type={type}
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
                            {selectedRecord.oilType}
                        </p>
                    )}
                </div>
            </Modal>

            {/* Image Viewer Modal */}
            <Modal
                isOpen={isImageOpen}
                onClose={() => setIsImageOpen(false)}
                title={t("image")}
            >
                <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl">
                    {selectedImage && (
                        <Image
                            src={selectedImage}
                            alt="Oil Preview"
                            fill
                            className="object-contain bg-slate-900"
                            unoptimized
                        />
                    )}
                </div>
            </Modal>
        </div>
    );
}
