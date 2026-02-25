"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/ui/Input";
import Button from "@/ui/Button";

export default function AccountSecurity() {
    const t = useTranslations("settings.security");
    const tButtons = useTranslations("buttons");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle password change submission
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            <div className="space-y-4">
                <Input
                    label={t("currentPassword")}
                    placeholder={t("currentPassword")}
                    name="currentPassword"
                    type="password"
                    required
                />
                <hr className="border-slate-100 dark:border-slate-800" />
                <Input
                    label={t("newPassword")}
                    placeholder={t("newPassword")}
                    name="newPassword"
                    type="password"
                    required
                />
                <Input
                    label={t("confirmPassword")}
                    placeholder={t("confirmPassword")}
                    name="confirmPassword"
                    type="password"
                    required
                />
            </div>

            <div className="flex justify-end">
                <Button type="submit">
                    {tButtons("save")}
                </Button>
            </div>
        </form>
    );
}
