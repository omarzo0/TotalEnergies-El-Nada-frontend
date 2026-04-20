"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { useOilShift } from "../hooks/useOilShift";
import { useOils } from "../hooks/useOils";
import Button from "@/ui/Button";
import { Input, Select } from "@/ui/Input";
import { DataRow } from "@/types";
import { OilSalesSkeleton } from "../ui/OilsSkeleton";

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

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedOil, setSelectedOil] = useState<any>(null);
    const [formData, setFormData] = useState({
        oilName: "",
        firstTermBalance: 0,
        endTermBalance: 0,
        incoming: 0
    });

    const rows: DataRow[] = shiftSales.map((record, index) => {
        const oilMaster = oils.find(o => o.oilName === record.oilName);
        return {
            cells: [
                record.oilName,
                (record.firstTermBalance || 0).toString(),
                (record.endTermBalance || 0).toString(),
                (record.incoming || 0).toString(),
                (record.sold || 0).toString(),
                (oilMaster?.price || 0).toLocaleString(),
                (record.total || 0).toLocaleString()
            ],
            editable: true,
            deletable: true,
            id: record._id || record.id || `record-${index}`
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
        const record = shiftSales[index];
        const oilMaster = oils.find(o => o.oilName === record.oilName);
        setSelectedOil(oilMaster || { oilName: record.oilName });
        setFormData({
            oilName: record.oilName,
            firstTermBalance: record.firstTermBalance || 0,
            endTermBalance: record.endTermBalance || 0,
            incoming: record.incoming || 0
        });
        setIsEditOpen(true);
    };
    const handleDelete = (index: number) => {
        const record = shiftSales[index];
        setSelectedOil({ oilName: record.oilName, recordId: record._id || record.id });
        setIsDeleteOpen(true);
    };

    const handleAdd = () => {
        setSelectedOil(null);
        setFormData({
            oilName: oils[0]?.oilName || "",
            firstTermBalance: 0,
            endTermBalance: 0,
            incoming: 0
        });
        setIsCreateOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateShiftSales(formData);
        setIsEditOpen(false);
        setIsCreateOpen(false);
    };

    const confirmDelete = async () => {
        if (selectedOil?.recordId) {
            await removeShiftSale(selectedOil.recordId);
            setIsDeleteOpen(false);
        }
    };

    return (
        <div>
            <div className="flex justify-end mb-6">
                <Button onClick={handleAdd} className="flex items-center gap-2">
                    <i className="bx bx-plus"></i>
                    {tButtons("add")}
                </Button>
            </div>

            {isLoading ? (
                <OilSalesSkeleton />
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        rows={rows}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                    {rows.length === 0 && (
                        <div className="text-center py-20 text-slate-400">
                            <i className="bx bx-receipt text-5xl mb-3 block"></i>
                            <p>No sales records found for {new Date(date).toLocaleDateString()}.</p>
                        </div>
                    )}
                </>
            )}

            <Modal
                isOpen={isCreateOpen || isEditOpen}
                onClose={() => { setIsCreateOpen(false); setIsEditOpen(false); }}
                title={isCreateOpen ? tModals("createRecordTitle") : `${tModals("editRecordTitle")} - ${selectedOil?.oilName}`}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <p className="text-sm font-bold text-slate-700 mb-2">{tOils("salesReadingTitle")}</p>

                    {isCreateOpen && (
                        <div className="mb-4">
                            <Select
                                label={t("oilType")}
                                value={formData.oilName}
                                onChange={(e) => setFormData({ ...formData, oilName: e.target.value })}
                                options={oils.map(o => ({ label: o.oilName, value: o.oilName }))}
                                required
                            />
                        </div>
                    )}

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
                        <Button variant="secondary" onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); }}>
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
