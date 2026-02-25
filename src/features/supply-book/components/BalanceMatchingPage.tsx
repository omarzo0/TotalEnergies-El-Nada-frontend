"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import Modal from "@/components/shared/Modal";
import { useBalanceMatching } from "../hooks/useBalanceMatching";
import { DataRow, TabItem } from "@/types";

export default function BalanceMatchingPage() {
    const t = useTranslations("table.balanceMatching");
    const tBalance = useTranslations("balanceItems");
    const tModals = useTranslations("modals");
    const tButtons = useTranslations("buttons");
    const pathname = usePathname();

    const { balanceRecords, gauges, isLoading, updateGauge } = useBalanceMatching();
    const [isEditGaugeOpen, setIsEditGaugeOpen] = useState(false);
    const [selectedGauge, setSelectedGauge] = useState<any>(null);

    const tabs: TabItem[] = [
        { href: "/supply-book/records", labelKey: "supplyBook", active: false },
        { href: "/supply-book/balance-matching", labelKey: "balanceMatching", active: pathname === "/supply-book/balance-matching" },
    ];

    const columns = [t("gasoline95"), t("gasoline92"), t("gasoline80"), t("diesel"), t("description")];

    const balanceRows: DataRow[] = balanceRecords.map(record => ({
        cells: [record.gasoline95, record.gasoline92, record.gasoline80, record.diesel, tBalance(record.descriptionKey)],
        id: record.id
    }));

    const gaugeRows: DataRow[] = gauges.map(gauge => ({
        cells: [gauge.gasoline95, gauge.gasoline92, gauge.gasoline80, gauge.diesel, tBalance(gauge.descriptionKey)],
        editable: true,
        id: gauge.id
    }));

    const handleEditGauge = (index: number) => {
        setSelectedGauge(gauges[index]);
        setIsEditGaugeOpen(true);
    };

    return (
        <div className="pb-10">
            <Header titleKey="balanceMatching" tabs={tabs} />

            <div className="page-card shadow-glass mb-8">
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <DataTable columns={columns} rows={balanceRows} />
                )}
            </div>

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <i className="bx bx-tachometer text-primary"></i>
                    {tBalance("pumpGauges")}
                </h2>
            </div>

            <div className="page-card shadow-glass">
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        rows={gaugeRows}
                        onEdit={handleEditGauge}
                    />
                )}
            </div>

            {/* Simple Edit Gauge Modal (Mock) */}
            <Modal
                isOpen={isEditGaugeOpen}
                onClose={() => setIsEditGaugeOpen(false)}
                title={tModals("editRecordTitle")}
            >
                <div className="p-4 text-center">
                    <p className="text-slate-500 mb-6 font-medium">Gauge editing functionality would be implemented here in a real scenario.</p>
                    <button className="btn-primary w-full" onClick={() => setIsEditGaugeOpen(false)}>
                        {tButtons("confirm")}
                    </button>
                </div>
            </Modal>
        </div>
    );
}
