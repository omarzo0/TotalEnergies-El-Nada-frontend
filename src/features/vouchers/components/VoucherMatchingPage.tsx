"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import Button from "@/ui/Button";
import { useVouchers } from "../hooks/useVouchers";
import { DataRow, TabItem } from "@/types";
import { FuelType } from "../types/vouchers.types";

import { VoucherMatchingSkeleton } from "../ui/VoucherSkeleton";

export default function VoucherMatchingPage() {
    const t = useTranslations("table.voucherMatching");
    const tFuel = useTranslations("fuelTypes");
    const tEntities = useTranslations("entities");
    const tPrices = useTranslations("benzene.pricesTab");
    const pathname = usePathname();

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [activeFilter, setActiveFilter] = useState<{ type: 'pumpType' | 'side', key: string } | null>(null);

    // Construct filters object from activeFilter state
    const filters = activeFilter ? { [activeFilter.type]: activeFilter.key } : {};

    const { matchingRecords, matchingTotal, isLoading, error } = useVouchers(selectedDate, undefined, filters, { fetchVouchers: false, fetchMatching: true });

    const tabs: TabItem[] = [
        { href: "/vouchers/list", labelKey: "vouchers", active: false },
        { href: "/vouchers/matching", labelKey: "voucherMatching", active: true },
    ];

    const filterButtons = [
        { key: "solar", label: tFuel("diesel"), type: 'pumpType' as const },
        { key: "ben80", label: tFuel("gasoline80"), type: 'pumpType' as const },
        { key: "ben92", label: tFuel("gasoline92"), type: 'pumpType' as const },
        { key: "ben95", label: tFuel("gasoline95"), type: 'pumpType' as const },
        { key: "police", label: tEntities("police"), type: 'side' as const },
        { key: "association", label: tEntities("association"), type: 'side' as const },
    ];



    const handleFilter = (filter: any) => {
        setActiveFilter(filter.key === activeFilter?.key ? null : { type: filter.type, key: filter.key });
    };

    const columns = [t("liters"), t("count") || "العدد", t("total"), t("price") || "السعر", tEntities("police") ? "الجهة" : "Entity"];
    const rows: DataRow[] = (matchingRecords || []).map(record => ({
        cells: [
            (record?.liters ?? 0).toString(),
            (record?.number ?? 0).toString(),
            (record?.total ?? 0).toLocaleString(),
            (record?.price ?? 0).toLocaleString(),
            record?.side ? (tEntities(record.side) || record.side) : "—"
        ],
        editable: false
    }));



    return (
        <div className="pb-10">
            <Header titleKey="voucherMatching" tabs={tabs}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-6">
                    <div className="flex flex-wrap gap-2">
                        {filterButtons.map((btn) => (
                            <Button
                                key={btn.key}
                                variant={activeFilter?.key === btn.key ? "primary" : "secondary"}
                                className={`text-xs !px-4 !py-2 transition-all duration-300 ${activeFilter?.key === btn.key ? 'shadow-lg scale-105' : 'opacity-80 hover:opacity-100'}`}
                                onClick={() => handleFilter(btn)}
                            >
                                {btn.label}
                            </Button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{tPrices("date")}:</span>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer"
                        />
                    </div>
                </div>
            </Header>

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-3">
                    <i className="bx bx-error-circle text-2xl"></i>
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <div className="page-card shadow-glass mt-8">
                <div className="mb-4 flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-700">{t("voucherMatching")}</h3>
                    <div className="text-right">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider uppercase">{t("total")}</p>
                        <p className="text-2xl font-black text-primary">{(matchingTotal ?? 0).toLocaleString()} <span className="text-sm font-normal text-slate-400">ج.م</span></p>

                    </div>
                </div>

                {isLoading ? (
                    <VoucherMatchingSkeleton />
                ) : (
                    <>
                        <DataTable columns={columns} rows={rows} />
                        {matchingRecords.length === 0 && (
                            <div className="text-center py-20 text-slate-400">
                                <i className="bx bx-list-check text-5xl mb-3 block"></i>
                                <p>No matching summary found for this period.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

