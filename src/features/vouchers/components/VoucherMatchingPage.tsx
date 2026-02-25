"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import DataTable from "@/components/shared/DataTable";
import Button from "@/ui/Button";
import { useVouchers } from "../hooks/useVouchers";
import { DataRow, TabItem } from "@/types";
import { FuelType, VoucherEntity } from "../types/vouchers.types";

export default function VoucherMatchingPage() {
    const t = useTranslations("table.voucherMatching");
    const tFuel = useTranslations("fuelTypes");
    const tEntities = useTranslations("entities");
    const pathname = usePathname();

    const { matchingRecords, isLoading, fetchMatching } = useVouchers();
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    useEffect(() => {
        fetchMatching();
    }, [fetchMatching]);

    const tabs: TabItem[] = [
        { href: "/vouchers/list", labelKey: "vouchers", active: false },
        { href: "/vouchers/matching", labelKey: "voucherMatching", active: true },
    ];

    const filterButtons = [
        { key: "diesel", label: tFuel("diesel"), type: 'fuel' },
        { key: "gasoline80", label: tFuel("gasoline80"), type: 'fuel' },
        { key: "gasoline92", label: tFuel("gasoline92"), type: 'fuel' },
        { key: "gasoline95", label: tFuel("gasoline95"), type: 'fuel' },
        { key: "police", label: tEntities("police"), type: 'entity' },
        { key: "association", label: tEntities("association"), type: 'entity' },
    ];

    const handleFilter = (filter: any) => {
        setActiveFilter(filter.key === activeFilter ? null : filter.key);
        // In a real app, this would trigger a refetch with filters
        fetchMatching(filter.key === activeFilter ? undefined : {
            [filter.type]: filter.key
        });
    };

    const columns = [t("total"), t("category"), t("count")];
    const rows: DataRow[] = matchingRecords.map(record => ({
        cells: [record.total, record.category, record.count],
        editable: false
    }));

    return (
        <div className="pb-10">
            <Header titleKey="voucherMatching" tabs={tabs}>
                <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
                    {filterButtons.map((btn) => (
                        <Button
                            key={btn.key}
                            variant={activeFilter === btn.key ? "primary" : "secondary"}
                            className={`text-xs !px-4 !py-2 transition-all duration-300 ${activeFilter === btn.key ? 'shadow-lg scale-105' : 'opacity-80 hover:opacity-100'}`}
                            onClick={() => handleFilter(btn)}
                        >
                            {btn.label}
                        </Button>
                    ))}
                </div>
            </Header>

            <div className="page-card shadow-glass mt-8">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <DataTable columns={columns} rows={rows} />
                )}
            </div>
        </div>
    );
}
