"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { useOilShift } from "../hooks/useOilShift";
import { useOils } from "../hooks/useOils";
import Button from "@/ui/Button";
import { Input } from "@/ui/Input";
import { DataRow } from "@/types";

interface OilSalesTabProps {
    date: string;
    oils: any[];
}

export default function OilSalesTab({ date, oils }: OilSalesTabProps) {
    const t = useTranslations("table.oils");
    const tOils = useTranslations("oils");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");

    const { shiftSales, isLoading, updateShiftSales, removeShiftSale } = useOilShift(date);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedOil, setSelectedOil] = useState<any>(null);
    const [formData, setFormData] = useState({
        firstTermBalance: 0,
        endTermBalance: 0,
        incoming: 0
    });

    const rows: DataRow[] = oils.map(oil => {
        const record = shiftSales.find(s => s.oilName === oil.oilName);
        return {
            cells: [
                oil.oilName,
                (record?.firstTermBalance ?? 0).toString(),
                (record?.endTermBalance ?? 0).toString(),
                (record?.incoming ?? 0).toString(),
                (record?.sold ?? 0).toString(),
                (oil.price ?? 0).toLocaleString(),
                (record?.total ?? 0).toLocaleString()
            ],
            editable: true,
            // Only show delete option if a record actually exists for this date
            deletable: !!record,
            id: oil.oilName
        };
    });

    const columns = [
        t("oilType"),
        t("firstTermBalance"),
        t("endTermBalance"),
        t("incoming"),
        t("sold"),
        t("price"),
        t("total")
    ];

    const handleEdit = (index: number) => {
        const oil = oils[index];
        const record = shiftSales.find(s => s.oilName === oil.oilName);
        setSelectedOil(oil);
        setFormData({
            firstTermBalance: record?.firstTermBalance ?? 0,
            endTermBalance: record?.endTermBalance ?? 0,
            incoming: record?.incoming ?? 0
        });
        setIsEditOpen(true);
    };

    const handleDelete = (index: number) => {
        const oil = oils[index];
        const record = shiftSales.find(s => s.oilName === oil.oilName);
        if (record) {
            setSelectedOil({ ...oil, recordId: record._id || record.id });
            setIsDeleteOpen(true);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedOil) {
            await updateShiftSales({
                oilName: selectedOil.oilName,
                ...formData
            });
            setIsEditOpen(false);
        }
    };

    const confirmDelete = async () => {
        if (selectedOil?.recordId) {
            await removeShiftSale(selectedOil.recordId);
            setIsDeleteOpen(false);
        }
    };

    return (
        <div>
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

            <Modal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title={`${tModals("editRecordTitle")} - ${selectedOil?.oilName}`}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <p className="text-sm font-bold text-slate-700 mb-2">{tOils("salesReadingTitle")}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label={tOils("firstTermLabel")}
                            type="number"
                            value={formData.firstTermBalance}
                            onChange={(e) => setFormData({ ...formData, firstTermBalance: Number(e.target.value) })}
                            required
                        />
                        <Input
                            label={tOils("endTermLabel")}
                            type="number"
                            value={formData.endTermBalance}
                            onChange={(e) => setFormData({ ...formData, endTermBalance: Number(e.target.value) })}
                            required
                        />
                        <Input
                            label={tOils("incoming")}
                            type="number"
                            value={formData.incoming}
                            onChange={(e) => setFormData({ ...formData, incoming: Number(e.target.value) })}
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
