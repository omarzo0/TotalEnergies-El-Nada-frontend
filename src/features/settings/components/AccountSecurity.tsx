"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/ui/Input";
import Button from "@/ui/Button";
import { authApi } from "../../auth/api/auth.api";

export default function AccountSecurity() {
    const t = useTranslations("settings.security");
    const tButtons = useTranslations("buttons");

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
        setSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            setError(t("passwordsDoNotMatch"));
            return;
        }

        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            await authApi.changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });
            setSuccess(true);
            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 italic text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 text-sm">
                    {t("passwordUpdateSuccess")}
                </div>
            )}

            <div className="space-y-4">
                <Input
                    label={t("currentPassword")}
                    placeholder={t("currentPassword")}
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                />
                <hr className="border-slate-100 dark:border-slate-800" />
                <Input
                    label={t("newPassword")}
                    placeholder={t("newPassword")}
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                />
                <Input
                    label={t("confirmPassword")}
                    placeholder={t("confirmPassword")}
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={saving}>
                    {saving ? tButtons("saving") : tButtons("save")}
                </Button>
            </div>
        </form>
    );
}
