"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/ui/Input";
import Button from "@/ui/Button";
import { authApi } from "../../auth/api/auth.api";
import { AccountSettingsSkeleton } from "../ui/SettingsSkeleton";

import { useProfile } from "../hooks/useProfile";

export default function AccountSettings() {
    const t = useTranslations("settings.account");
    const tButtons = useTranslations("buttons");

    const { profile, isLoading, error: fetchError, updateProfile, isUpdating } = useProfile();

    const [saving, setSaving] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        language: "ar"
    });

    // Sync local state when profile is loaded
    useEffect(() => {
        if (profile) {
            setFormData({
                email: profile.email || "",
                firstName: profile.firstName || "",
                lastName: profile.lastName || "",
                phoneNumber: profile.phoneNumber || "",
                language: profile.language || "ar"
            });
        }
    }, [profile]);

    const error = localError || fetchError;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setSuccess(false);
        setLocalError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setLocalError(null);
        setSuccess(false);
        try {
            await updateProfile(formData);
            setSuccess(true);
        } catch (err: any) {
            setLocalError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (isLoading) {
        return <AccountSettingsSkeleton />;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 italic text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 text-sm">
                    {t("updateSuccess")}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label={t("firstName")}
                    placeholder={t("firstName")}
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
                <Input
                    label={t("lastName")}
                    placeholder={t("lastName")}
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
                <Input
                    label={t("email")}
                    placeholder={t("email")}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <Input
                    label={t("phoneNumber")}
                    placeholder={t("phoneNumber")}
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                />
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">{t("language")}</label>
                    <select
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm appearance-none"
                    >
                        <option value="ar">العربية</option>
                        <option value="en">English</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={saving}>
                    {saving ? tButtons("saving") : tButtons("save")}
                </Button>
            </div>
        </form>
    );
}
