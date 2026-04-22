"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/ui/Input";
import Button from "@/ui/Button";
import { useStation } from "../hooks/useStation";
import { AccountSettingsSkeleton } from "../ui/SettingsSkeleton";

export default function StationSettings() {
    const t = useTranslations("settings.station");
    const tButtons = useTranslations("buttons");

    const { station, isLoading, error: fetchError, updateStation, isUpdating } = useStation();

    const [localError, setLocalError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        nameAr: "",
        code: "",
        address: "",
        phone: "",
        logo: ""
    });

    useEffect(() => {
        if (station) {
            setFormData({
                name: station.name || "",
                nameAr: station.nameAr || "",
                code: station.code || "",
                address: station.address || "",
                phone: station.phone || "",
                logo: station.logo || ""
            });
        }
    }, [station]);

    const error = localError || fetchError;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setSuccess(false);
        setLocalError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        setSuccess(false);
        try {
            await updateStation({
                name: formData.name,
                nameAr: formData.nameAr,
                address: formData.address,
                phone: formData.phone,
                logo: formData.logo
            });
            setSuccess(true);
        } catch (err: any) {
            setLocalError(err.message);
        }
    };

    if (isLoading) {
        return <AccountSettingsSkeleton />;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
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
                    label={t("name")}
                    placeholder={t("namePlaceholder")}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <Input
                    label={t("nameAr")}
                    placeholder={t("nameArPlaceholder")}
                    name="nameAr"
                    value={formData.nameAr}
                    onChange={handleChange}
                    required
                />
                <Input
                    label={t("code")}
                    name="code"
                    value={formData.code}
                    disabled
                    readOnly
                />
                <Input
                    label={t("phone")}
                    placeholder={t("phonePlaceholder")}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />
                <Input
                    label={t("address")}
                    placeholder={t("addressPlaceholder")}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                />
                <div className="md:col-span-2">
                    <Input
                        label={t("logo")}
                        placeholder={t("logoPlaceholder")}
                        name="logo"
                        value={formData.logo}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? tButtons("saving") : tButtons("save")}
                </Button>
            </div>
        </form>
    );
}
