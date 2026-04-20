"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { useOilStorage } from "../hooks/useOilStorage";
import { useOils } from "../hooks/useOils";
import Button from "@/ui/Button";
import { Input } from "@/ui/Input";
import { DataRow } from "@/types";
import { OilInventorySkeleton } from "../ui/OilsSkeleton";

interface OilInventoryTabProps {
    date: string;
    oils: any[];
}

export default function OilInventoryTab({ date, oils }: OilInventoryTabProps) {
    const t = useTranslations("table.oils");
    const tStorage = useTranslations("table.oilStorage");
    const tOils = useTranslations("oils");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");

    const { storage, isLoading, updateStorage, removeStorage } = useOilStorage(date);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedOil, setSelectedOil] = useState<any>(null);
    const [formData, setFormData] = useState({
        oilName: "",
        startBalance: 0,
        storageIncoming: 0
    });

    const rows: DataRow[] = oils.map(oil => {
        const record = storage.find(s => s.oilName === oil.oilName);
        return {
            cells: [
                oil.oilName,
                (oil.price || 0).toLocaleString(),
                (record?.startBalance ?? 0).toString(),
                (record?.storageIncoming ?? 0).toString(),
                (record?.endBalance ?? 0).toString(),
            ],
            editable: true,
            deletable: !!record,
            id: oil.oilName
        };
    });

    const columns = [
        t("oilType"),
        t("price"),
        t("startBalance"),
        tStorage("storageIncoming"),
        t("endBalance")
    ];

    const handleEdit = (index: number) => {
        const oil = oils[index];
        const record = storage.find(s => s.oilName === oil.oilName);
        setSelectedOil(oil);
        setFormData({
            oilName: oil.oilName,
            startBalance: record?.startBalance ?? 0,
            storageIncoming: record?.storageIncoming ?? 0
        });
        setIsEditOpen(true);
    };

    const handleDelete = (index: number) => {
        const oil = oils[index];
        const record = storage.find(s => s.oilName === oil.oilName);
        if (record) {
            setSelectedOil({ ...oil, recordId: record._id || record.id });
            setIsDeleteOpen(true);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedOil) {
            await updateStorage({
                oilName: selectedOil.oilName,
                ...formData
            });
            setIsEditOpen(false);
        }
    };

    const confirmDelete = async () => {
        if (selectedOil?.recordId) {
            await removeStorage(selectedOil.recordId);
            setIsDeleteOpen(false);
        }
    };

    return (
        <div>
            {isLoading ? (
                <OilInventorySkeleton />
            ) : (
                <DataTable
                    columns={columns}
                    rows={rows}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            <Modal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title={`${tModals("editRecordTitle")} - ${selectedOil?.oilName}`}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <p className="text-sm font-bold text-slate-700 mb-2">{tOils("inventoryReadingTitle")}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label={tOils("startStorageLabel")}
                            type="number"
                            value={formData.startBalance}
                            onChange={(e) => setFormData({ ...formData, startBalance: Number(e.target.value) })}
                            required
                        />
                        <Input
                            label={tOils("treasuryWardLabel")}
                            type="number"
                            value={formData.storageIncoming}
                            onChange={(e) => setFormData({ ...formData, storageIncoming: Number(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="secondary" onClick={() => setIsEditOpen(false)}>
                            {tButtons("cancel")}
                        </Button>
                        <Button type="submit">
                            {tButtons("save")}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                title={tModals("confirmDeleteTitle")}
                footer={
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={() => setIsDeleteOpen(false)}>
                            {tButtons("cancel")}
                        </Button>
                        <Button variant="danger" onClick={confirmDelete}>
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
                    <p className="mt-2 font-bold text-slate-800">{selectedOil?.oilName}</p>
                </div>
            </Modal>
        </div>
    );
}
