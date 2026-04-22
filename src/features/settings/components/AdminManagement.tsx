"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { DataRow } from "@/types";
import { adminsApi } from "../api/admins.api";
import { Input } from "@/ui/Input";
import Button from "@/ui/Button";
import { AdminManagementSkeleton } from "../ui/SettingsSkeleton";
import { useAdmins } from "../hooks/useAdmins";
import { PermissionGuard } from "@/features/auth/components/PermissionGuard";
import { usePermissions } from "@/features/auth/hooks/usePermissions";

export default function StaffManagement() {
    const t = useTranslations("settings.staff");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");
    const { can } = usePermissions();

    const {
        admins,
        isLoading,
        error: fetchError,
        createAdmin,
        updateAdmin,
        deleteAdmin
    } = useAdmins();

    const [isSaving, setIsSaving] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [searchEmail, setSearchEmail] = useState("");
    const [searchResults, setSearchResults] = useState<any[] | null>(null);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "manager",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        nationalId: ""
    });

    const displayAdmins = searchResults || admins;
    const error = localError || fetchError;

    const handleSearch = async () => {
        if (!searchEmail.trim()) {
            setSearchResults(null);
            return;
        }
        try {
            const data = await adminsApi.search(searchEmail);
            setSearchResults([data]);
        } catch (err: any) {
            setLocalError(err.message);
            setSearchResults([]);
        }
    };

    const handleOpenCreate = () => {
        setModalMode('create');
        setSelectedAdmin(null);
        setFormData({
            email: "",
            password: "",
            role: "manager",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            nationalId: ""
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (id: string) => {
        const admin = displayAdmins.find(a => (a.id || a._id) === id);
        if (!admin) return;
        setModalMode('edit');
        setSelectedAdmin(admin);
        setFormData({
            email: admin.email || "",
            password: "", // Don't show password
            role: admin.role || "manager",
            firstName: admin.firstName || "",
            lastName: admin.lastName || "",
            phoneNumber: admin.phoneNumber || "",
            nationalId: admin.nationalId || ""
        });
        setIsModalOpen(true);
    };

    const handleOpenDelete = (id: string) => {
        const admin = displayAdmins.find(a => (a.id || a._id) === id);
        if (!admin) return;
        setSelectedAdmin(admin);
        setIsDeleteOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setLocalError(null);
        try {
            if (modalMode === 'create') {
                await createAdmin(formData);
            } else {
                const id = selectedAdmin.id || selectedAdmin._id;
                const updateData = { ...formData };
                if (!updateData.password) delete (updateData as any).password;
                await updateAdmin(id, updateData);
            }
            setIsModalOpen(false);
        } catch (err: any) {
            setLocalError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDelete = async () => {
        setIsSaving(true);
        setLocalError(null);
        try {
            const id = selectedAdmin.id || selectedAdmin._id;
            await deleteAdmin(id);
            setIsDeleteOpen(false);
        } catch (err: any) {
            setLocalError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const columns = [
        t("table.name"),
        t("table.email"),
        t("table.role"),
        t("table.phoneNumber")
    ];

    const rows: DataRow[] = displayAdmins.map(admin => ({
        cells: [
            `${admin.firstName} ${admin.lastName}`,
            admin.email,
            admin.role,
            admin.phoneNumber || "-"
        ],
        editable: true,
        id: admin.id || admin._id
    }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">{t("title")}</h3>
                    <p className="text-slate-500 text-sm">{t("subtitle")}</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-grow md:w-64">
                        <input
                            type="text"
                            placeholder={t("searchPlaceholder")}
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                        <i className="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    </div>
                    <PermissionGuard resource="stationStaff" action="create">
                        <button
                            onClick={handleOpenCreate}
                            className="btn-primary flex items-center gap-2 whitespace-nowrap"
                        >
                            <i className="bx bx-plus text-lg"></i>
                            {tButtons("add")}
                        </button>
                    </PermissionGuard>
                </div>
            </div>

            {error && !isLoading && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 italic text-sm">
                    {error}
                </div>
            )}

            {isLoading ? (
                <AdminManagementSkeleton />
            ) : (
                <DataTable
                    columns={columns}
                    rows={rows}
                    onEdit={can('stationStaff', 'update') ? (index: number) => {
                        const admin = displayAdmins[index];
                        if (admin) handleOpenEdit(admin.id || admin._id);
                    } : undefined}
                    onDelete={can('stationStaff', 'delete') ? (index: number) => {
                        const admin = displayAdmins[index];
                        if (admin) handleOpenDelete(admin.id || admin._id);
                    } : undefined}
                />
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'create' ? tModals("createRecordTitle") : tModals("editRecordTitle")}
            >
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label={t("form.firstName")}
                            placeholder={t("form.firstName")}
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            required
                        />
                        <Input
                            label={t("form.lastName")}
                            placeholder={t("form.lastName")}
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            required
                        />
                        <Input
                            label={t("form.email")}
                            placeholder={t("form.email")}
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <Input
                            label={t("form.password")}
                            placeholder={modalMode === 'edit' ? t("form.passwordKeep") : t("form.password")}
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required={modalMode === 'create'}
                        />
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-700">{t("form.role")}</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm appearance-none"
                            >
                                <option value="admin">{t("roles.admin")}</option>
                                <option value="manager">{t("roles.manager")}</option>
                                <option value="cashier">{t("roles.cashier")}</option>
                                <option value="financial">{t("roles.financial")}</option>
                            </select>
                        </div>
                        <Input
                            label={t("form.phoneNumber")}
                            placeholder={t("form.phoneNumber")}
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        />
                        <Input
                            label={t("form.nationalId")}
                            placeholder={t("form.nationalId")}
                            value={formData.nationalId}
                            onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
                            {tButtons("cancel")}
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? tButtons("saving") : tButtons("save")}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <Modal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                title={tModals("deleteConfirmTitle")}
            >
                <div className="p-6">
                    <p className="text-slate-600 mb-6">
                        {t("deleteConfirmMessage")} <strong>{selectedAdmin?.email}</strong>?
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => setIsDeleteOpen(false)}>
                            {tButtons("cancel")}
                        </Button>
                        <Button variant="danger" onClick={confirmDelete} disabled={isSaving}>
                            {isSaving ? tButtons("deleting") : tButtons("delete")}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
