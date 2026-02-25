"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/ui/Input";
import { Employee } from "../../types/employees.types";
import { useEmployeesForm } from "../../hooks/useEmployeesForm";

interface EmployeeFormProps {
    initialData?: Employee;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export default function EmployeeForm({ initialData, onSubmit, onCancel, isEditing }: EmployeeFormProps) {
    const tLabels = useTranslations("labels");
    const tButtons = useTranslations("buttons");
    const { formData, errors, handleChange, validate } = useEmployeesForm(initialData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label={tLabels("name")}
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                error={errors.name}
                type="text"
            />
            <Input
                label={tLabels("nationalId")}
                value={formData.nationalId}
                onChange={(e) => handleChange("nationalId", e.target.value)}
                error={errors.nationalId}
                type="text"
            />
            <Input
                label={tLabels("phone")}
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                type="text"
            />
            <Input
                label={tLabels("position")}
                value={formData.position}
                onChange={(e) => handleChange("position", e.target.value)}
                type="text"
            />
            <Input
                label={tLabels("salary")}
                value={formData.salary}
                onChange={(e) => handleChange("salary", e.target.value)}
                type="text"
            />

            <div className="flex justify-end gap-3 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn-secondary"
                >
                    {tButtons("cancel")}
                </button>
                <button
                    type="submit"
                    className="btn-primary"
                >
                    {isEditing ? tButtons("save") : tButtons("confirm")}
                </button>
            </div>
        </form>
    );
}
