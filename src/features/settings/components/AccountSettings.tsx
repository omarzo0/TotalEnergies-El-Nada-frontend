"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/ui/Input";
import Button from "@/ui/Button";

export default function AccountSettings() {
    const t = useTranslations("settings.account");
    const tButtons = useTranslations("buttons");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label={t("name")}
                    placeholder={t("name")}
                    name="name"
                    required
                />
                <Input
                    label={t("username")}
                    placeholder={t("username")}
                    name="username"
                    required
                />
                <Input
                    label={t("email")}
                    placeholder={t("email")}
                    name="email"
                    type="email"
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
