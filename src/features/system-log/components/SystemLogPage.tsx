"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import { useSystemLog } from "../hooks/useSystemLog";
import { DataRow } from "@/types";

export default function SystemLogPage() {
    const t = useTranslations("table.systemLog");
    const { logs, isLoading } = useSystemLog();

    const columns = [t("modifiedTo"), t("modifiedFrom"), t("username"), t("type"), t("time"), t("date")];

    const rows: DataRow[] = logs.map(log => ({
        cells: [log.modifiedTo, log.modifiedFrom, log.username, log.type, log.time, log.date],
        id: log.id
    }));

    return (
        <div className="pb-10">
            <Header titleKey="systemLog" />

            <div className="page-card shadow-glass">
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
            </div>
        </div>
    );
}
