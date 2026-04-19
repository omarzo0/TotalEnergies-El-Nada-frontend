"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/ui/Input";
import Button from "@/ui/Button";
import { Employee, EmployeeFormData } from "../../types/employees.types";

interface EmployeeFormProps {
    initialData?: Employee;
    onSubmit: (data: EmployeeFormData) => void;
    onCancel: () => void;
    isEditing?: boolean;
}

export default function EmployeeForm({ initialData, onSubmit, onCancel, isEditing }: EmployeeFormProps) {
    const t = useTranslations("employees");
    const tLabels = useTranslations("labels");
    const tButtons = useTranslations("buttons");

    const [formData, setFormData] = useState<EmployeeFormData>({
        name: initialData?.name || "",
        nationalId: initialData?.nationalId || 0,
        mobileNum: initialData?.mobileNum || 0,
        job: initialData?.job || "",
        salary: initialData?.salary || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const isNumeric = ["nationalId", "mobileNum", "salary"].includes(name);
        setFormData(prev => ({
            ...prev,
            [name]: isNumeric ? (value === "" ? 0 : Number(value)) : value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label={tLabels("name")}
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />

            <Input
                label={tLabels("nationalIdShort")}
                name="nationalId"
                type="number"
                value={formData.nationalId || ""}
                onChange={handleChange}
                required
            />

            <Input
                label={tLabels("phoneShort")}
                name="mobileNum"
                type="number"
                value={formData.mobileNum || ""}
                onChange={handleChange}
                required
            />

            <Input
                label={tLabels("positionShort")}
                name="job"
                value={formData.job}
                onChange={handleChange}
                required
            />

            <Input
                label={tLabels("salaryShort")}
                name="salary"
                type="number"
                value={formData.salary || ""}
                onChange={handleChange}
                required
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    {tButtons("cancel")}
                </Button>
                <Button type="submit">
                    {isEditing ? tButtons("save") : tButtons("add")}
                </Button>
            </div>
        </form>
    );
}
