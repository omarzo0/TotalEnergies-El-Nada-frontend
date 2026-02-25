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

export default function EmployeesPage() {
    const t = useTranslations("employees");
    const tTable = useTranslations("table.employees");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");

    const { employees, isLoading, addEmployee, updateEmployee, removeEmployee } = useEmployees();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    const columns = [
        tTable("name"),
        tTable("nationalId"),
        tTable("phone"),
        tTable("position"),
        tTable("salary")
    ];

    const rows: DataRow[] = employees.map(emp => ({
        cells: [emp.name, emp.nationalId, emp.phone, emp.position, emp.salary],
        editable: true,
        id: emp.id
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
            await updateEmployee(selectedEmployee.id, data);
            setIsEditOpen(false);
        }
    };

    const onDeleteConfirm = async () => {
        if (selectedEmployee) {
            await removeEmployee(selectedEmployee.id);
            setIsDeleteOpen(false);
        }
    };

    return (
        <div className="pb-10">
            <Header titleKey="employees" />

            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <i className="bx bx-plus text-lg"></i>
                    {tButtons("add")}
                </button>
            </div>

            <div className="page-card">
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

            {/* Delete Modal */}
            <Modal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                title={tModals("confirmDeleteTitle")}
                footer={
                    <>
                        <button className="btn-secondary" onClick={() => setIsDeleteOpen(false)}>
                            {tButtons("cancel")}
                        </button>
                        <button className="btn-danger" onClick={onDeleteConfirm}>
                            {tButtons("delete")}
                        </button>
                    </>
                }
            >
                <div className="text-center py-4">
                    <i className="bx bx-error-circle text-5xl text-danger/20 mb-4"></i>
                    <p className="text-slate-600">{tModals("confirmDeleteMessage")}</p>
                    {selectedEmployee && (
                        <p className="mt-2 font-bold text-slate-800">{selectedEmployee.name}</p>
                    )}
                </div>
            </Modal>
        </div>
    );
}
