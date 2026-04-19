"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { useEmployees } from "../hooks/useEmployees";
import EmployeeForm from "./forms/EmployeeForm";
import { Employee } from "../types/employees.types";
import { DataRow } from "@/types";
import { Input } from "@/ui/Input";

export default function EmployeesPage() {
    const t = useTranslations("employees");
    const tLabels = useTranslations("labels");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");

    const {
        employees,
        isLoading,
        error,
        searchName,
        setSearchName,
        addEmployee,
        updateEmployee,
        removeEmployee
    } = useEmployees();

    // Modals state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    const columns = [
        tLabels("name"),
        tLabels("nationalIdShort"),
        tLabels("phoneShort"),
        tLabels("positionShort"),
        tLabels("salaryShort")
    ];

    const rows: DataRow[] = employees.map(emp => ({
        cells: [
            emp.name,
            emp.nationalId.toString(),
            emp.mobileNum.toString(),
            emp.job,
            emp.salary.toLocaleString()
        ],
        editable: true,
        id: emp.id || emp._id
    }));

    const handleEdit = (index: number) => {
        setSelectedEmployee(employees[index]);
        setIsEditOpen(true);
    };

    const handleDelete = (index: number) => {
        setSelectedEmployee(employees[index]);
        setIsDeleteOpen(true);
    };

    const onAddSubmit = async (data: any) => {
        await addEmployee(data);
        setIsCreateOpen(false);
    };

    const onEditSubmit = async (data: any) => {
        if (selectedEmployee) {
            await updateEmployee(selectedEmployee.id || selectedEmployee._id!, data);
            setIsEditOpen(false);
        }
    };

    const onDeleteConfirm = async () => {
        if (selectedEmployee) {
            await removeEmployee(selectedEmployee.id || selectedEmployee._id!);
            setIsDeleteOpen(false);
        }
    };

    return (
        <div className="pb-10">
            <Header titleKey="employees" />

            {/* Filters Section */}
            <div className="page-card mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-3">
                        <Input
                            label={tLabels("name")}
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            placeholder={tLabels("enterName")}
                        />
                    </div>
                    <button
                        className="btn-primary h-[42px] flex items-center justify-center gap-2"
                        disabled={isLoading}
                    >
                        <i className="bx bx-search text-lg"></i>
                        {isLoading ? "..." : tButtons("search") || "Search"}
                    </button>
                </div>
            </div>

            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <i className="bx bx-plus text-lg"></i>
                    {tButtons("add")}
                </button>
            </div>

            {/* Table Section */}
            <div className="page-card">
                {error && (
                    <div className="p-4 mb-6 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-3">
                        <i className="bx bx-error-circle text-2xl"></i>
                        <p>{error}</p>
                    </div>
                )}

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

                {!isLoading && employees.length === 0 && !error && (
                    <div className="text-center py-20 text-slate-400">
                        <i className="bx bx-user text-5xl mb-3 block"></i>
                        <p>No employees found.</p>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title={tModals("createRecordTitle")}
            >
                <EmployeeForm
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
                <EmployeeForm
                    initialData={selectedEmployee || undefined}
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
                    {selectedEmployee && (
                        <p className="mt-2 font-bold text-slate-800 uppercase">
                            {selectedEmployee.name}
                        </p>
                    )}
                </div>
            </Modal>
        </div>
    );
}
