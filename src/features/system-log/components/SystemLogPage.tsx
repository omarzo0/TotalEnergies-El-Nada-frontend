"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import { useSystemLog } from "../hooks/useSystemLog";
import { DataRow } from "@/types";
import { Input, Select } from "@/ui/Input";
import { LogType } from "../types/system-log.types";

export default function SystemLogPage() {
    const t = useTranslations("systemLog");
    const tButtons = useTranslations("buttons");

    const {
        logs,
        isLoading,
        error,
        filters,
        setFilters,
        refresh
    } = useSystemLog();

    const columns = [
        t("adminName"),
        t("role"),
        t("type"),
        t("category"),
        t("move"),
        t("time")
    ];

    const rows: DataRow[] = logs.map(log => ({
        cells: [
            log.adminName || log.email || "-",
            log.role || "-",
            log.type || "-",
            log.category || "-",
            log.move || "-",
            log.time || "-"
        ],
        id: log.id || log._id
    }));

    const typeOptions = [
        { value: "ALL", label: "All Types" },
        { value: "LOGIN", label: "Login" },
        { value: "LOGOUT", label: "Logout" },
        { value: "CREATE", label: "Create" },
        { value: "UPDATE", label: "Update" },
        { value: "DELETE", label: "Delete" },
        { value: "VIEW", label: "View" },
    ];

    return (
        <div className="pb-10">
            <Header titleKey="systemLog" />

            {/* Filters Section */}
            <div className="page-card mb-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <Input
                        label={t("date")}
                        type="date"
                        value={filters.date}
                        onChange={(e) => setFilters.setDate(e.target.value)}
                    />

                    <Input
                        label={t("adminName")}
                        placeholder="Email..."
                        value={filters.email}
                        onChange={(e) => setFilters.setEmail(e.target.value)}
                    />

                    <Select
                        label={t("type")}
                        value={filters.type}
                        onChange={(e) => setFilters.setType(e.target.value as LogType | 'ALL')}
                        options={typeOptions}
                    />

                    <Input
                        label={t("category")}
                        placeholder="Oil, Benzene..."
                        value={filters.category}
                        onChange={(e) => setFilters.setCategory(e.target.value)}
                    />

                    <button
                        onClick={refresh}
                        className="btn-primary h-[42px] flex items-center justify-center gap-2"
                        disabled={isLoading}
                    >
                        <i className="bx bx-search text-lg"></i>
                        {tButtons("search")}
                    </button>
                </div>
            </div>

            <div className="page-card shadow-glass relative">
                {error && (
                    <div className="p-4 mb-6 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-3">
                        <i className="bx bx-error-circle text-2xl"></i>
                        <p>{error}</p>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        rows={rows}
                    />
                )}

                {!isLoading && logs.length === 0 && !error && (
                    <div className="text-center py-20 text-slate-400">
                        <i className="bx bx-history text-5xl mb-3 block"></i>
                        <p>No activity logs found for these filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
