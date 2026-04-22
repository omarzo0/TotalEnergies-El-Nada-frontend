"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Tabs from "@/ui/Tabs";
import AccountSettings from "./AccountSettings";
import AccountSecurity from "./AccountSecurity";
import AdminManagement from "./AdminManagement";
import StationSettings from "./StationSettings";
import SupportTicketsTab from "@/features/support/components/SupportTicketsTab";
import WarningsTab from "@/features/support/components/WarningsTab";

import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SettingsPage() {
    const t = useTranslations("settings");
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab");

    const [activeTab, setActiveTab] = useState("account");
    const { can } = usePermissions();

    useEffect(() => {
        if (tabParam === "station_warnings") {
            setActiveTab("warnings");
        }
    }, [tabParam]);

    const tabs = [
        { id: "account", label: t("tabs.account"), icon: "bx-user-circle" },
        { id: "security", label: t("tabs.security"), icon: "bx-shield-quarter" },
        { id: "staff", label: t("tabs.staff"), icon: "bx-group", resource: 'stationStaff' },
        { id: "station", label: t("tabs.station"), icon: "bx-station", resource: 'station', action: 'update' },
        { id: "support", label: t("tabs.support"), icon: "bx-message-square-detail", resource: 'support' },
        { id: "warnings", label: t("tabs.warnings"), icon: "bx-error", resource: 'support' }
    ].filter(tab => !tab.resource || can(tab.resource as any, tab.action as any || 'read'));

    const renderTabContent = () => {
        switch (activeTab) {
            case "account":
                return <AccountSettings />;
            case "security":
                return <AccountSecurity />;
            case "staff":
                return <AdminManagement />;
            case "station":
                return <StationSettings />;
            case "support":
                return <SupportTicketsTab />;
            case "warnings":
                return <WarningsTab />;
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
