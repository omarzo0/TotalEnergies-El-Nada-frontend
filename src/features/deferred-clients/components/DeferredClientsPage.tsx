"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import Image from "next/image";
import { useDeferredClients } from "../hooks/useDeferredClients";
import DeferredClientForm from "./forms/DeferredClientForm";
import { DeferredClientRecord } from "../types/deferred-clients.types";
import { DataRow } from "@/types";

export default function DeferredClientsPage() {
    const t = useTranslations("table.clients");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");

    const { clients, isLoading, addClient, updateClient, removeClient } = useDeferredClients();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isImageOpen, setIsImageOpen] = useState(false);

    const [selectedClient, setSelectedClient] = useState<DeferredClientRecord | null>(null);

    const columns = [t("amount"), t("receipt"), t("client"), t("image")];

    const rows: DataRow[] = clients.map(client => ({
        cells: [client.amount, client.receipt, client.client, client.image],
        editable: true,
        id: client.id
    }));

    const handleEdit = (index: number) => {
        setSelectedClient(clients[index]);
        setIsEditOpen(true);
    };

    const handleDelete = (index: number) => {
        setSelectedClient(clients[index]);
        setIsDeleteOpen(true);
    };

    const handleImageClick = (url: string) => {
        const client = clients.find(c => c.image === url);
        if (client) {
            setSelectedClient(client);
            setIsImageOpen(true);
        }
    };

    const onAddSubmit = async (data: any) => {
        await addClient(data);
        setIsCreateOpen(false);
    };

    const onEditSubmit = async (data: any) => {
        if (selectedClient && selectedClient.id) {
            await updateClient(selectedClient.id, data);
            setIsEditOpen(false);
        }
    };

    const onDeleteConfirm = async () => {
        if (selectedClient && selectedClient.id) {
            await removeClient(selectedClient.id);
            setIsDeleteOpen(false);
        }
    };

    return (
        <div className="pb-10">
            <Header titleKey="deferredClients" />

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
                    initialData={selectedClient || undefined}
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
                {selectedClient && (
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 group shadow-inner border border-slate-200/50">
                        <Image
                            src={selectedClient.image}
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
                    {selectedClient && (
                        <p className="mt-2 font-bold text-slate-800">
                            {selectedClient.client} - {selectedClient.receipt} ({selectedClient.amount})
                        </p>
                    )}
                </div>
            </Modal>
        </div>
    );
}
