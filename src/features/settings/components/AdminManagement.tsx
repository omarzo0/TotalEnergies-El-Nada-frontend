"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { DataRow } from "@/types";

export default function AdminManagement() {
    const t = useTranslations("settings.admins");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Placeholder data
    const admins = [
        { id: "1", name: "Admin User", username: "admin", role: "Super Admin", status: "Active" }
    ];

    const columns = [
        t("table.name"),
        t("table.username"),
        t("table.role"),
        t("table.status")
    ];

    const rows: DataRow[] = admins.map(admin => ({
        cells: [admin.name, admin.username, admin.role, admin.status],
        editable: true,
        id: admin.id
    }));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">{t("title")}</h3>
                    <p className="text-slate-500 text-sm">{t("subtitle")}</p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <i className="bx bx-plus text-lg"></i>
                    {tButtons("add")}
                </button>
            </div>

            <DataTable
                columns={columns}
                rows={rows}
                onEdit={() => setIsEditOpen(true)}
                onDelete={() => setIsDeleteOpen(true)}
            />

            {/* Modals would go here, following the pattern in EmployeesPage.tsx */}
            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title={tModals("createRecordTitle")}
            >
                <div className="p-4">Admin creation form placeholder</div>
            </Modal>
        </div>
    );
}
