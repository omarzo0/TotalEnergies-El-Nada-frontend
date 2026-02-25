"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Tabs from "@/ui/Tabs";
import AccountSettings from "./AccountSettings";
import AccountSecurity from "./AccountSecurity";
import AdminManagement from "./AdminManagement";

export default function SettingsPage() {
    const t = useTranslations("settings");
    const [activeTab, setActiveTab] = useState("account");

    const tabs = [
        { id: "account", label: t("tabs.account"), icon: "bx-user-circle" },
        { id: "security", label: t("tabs.security"), icon: "bx-shield-quarter" },
        { id: "admins", label: t("tabs.admins"), icon: "bx-group" }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case "account":
                return <AccountSettings />;
            case "security":
                return <AccountSecurity />;
            case "admins":
                return <AdminManagement />;
            default:
                return null;
        }
    };

    return (
        <div className="pb-10">
            <Header titleKey="settings" />

            <div className="page-card !p-0 overflow-hidden">
                <Tabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                />

                <div className="p-6 pt-0">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
}
