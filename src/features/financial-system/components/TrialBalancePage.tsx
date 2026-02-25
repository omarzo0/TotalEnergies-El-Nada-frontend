"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import { useFinancialSystem } from "../hooks/useFinancialSystem";
import { DataRow } from "@/types";

export default function TrialBalancePage() {
    const t = useTranslations("pages");
    const tTable = useTranslations("table.financial");
    const { trialBalance, isLoading } = useFinancialSystem();

    const tabs = [
        { labelKey: "trialBalance", href: "/financial-system/trial-balance", active: true },
        { labelKey: "incomeStatement", href: "/financial-system/income-statement", active: false },
    ];

    const columns = [
        tTable("accountName"),
        tTable("debit"),
        tTable("credit"),
        tTable("balance")
    ];

    const rows: DataRow[] = trialBalance.map(entry => ({
        cells: [
            entry.name,
            entry.debit.toLocaleString(),
            entry.credit.toLocaleString(),
            entry.balance.toLocaleString()
        ],
        id: entry.id
    }));

    return (
        <div className="pb-10">
            <Header titleKey="financialSystem" tabs={tabs} />

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
