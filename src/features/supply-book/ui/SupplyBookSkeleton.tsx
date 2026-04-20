"use client";

import React from "react";
import Skeleton from "@/ui/Skeleton";

export function SupplyBookTableSkeleton() {
    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Header Row Placeholder */}
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <Skeleton key={i} variant="text" width={70} className="mb-0" />
                ))}
            </div>
            {/* Table Body Placeholder Rows */}
            <div className="divide-y divide-slate-50">
                {[1, 2, 3, 4, 5].map((row) => (
                    <div key={row} className="px-6 py-5 flex justify-between gap-4">
                        <Skeleton variant="text" width={80} className="mb-0" />
                        <Skeleton variant="text" width={60} className="mb-0" />
                        <Skeleton variant="text" width={60} className="mb-0" />
                        <Skeleton variant="text" width={60} className="mb-0" />
                        <Skeleton variant="text" width={100} className="mb-0" />
                        <Skeleton variant="text" width={60} className="mb-0" />
                        <Skeleton variant="text" width={80} className="mb-0 font-bold" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function BalanceMatchingSkeleton() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Top Balance Table Placeholder */}
            <div className="page-card shadow-glass overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} variant="text" width={80} className="mb-0" />
                    ))}
                </div>
                <div className="divide-y divide-slate-50">
                    {[1, 2, 3, 4, 5].map((row) => (
                        <div key={row} className="px-6 py-4 flex justify-between gap-4">
                            <Skeleton variant="text" width={70} className="mb-0" />
                            <Skeleton variant="text" width={70} className="mb-0" />
                            <Skeleton variant="text" width={70} className="mb-0" />
                            <Skeleton variant="text" width={70} className="mb-0" />
                            <Skeleton variant="text" width={100} className="mb-0" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Gauges Section Header Placeholder */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" width={140} height={28} className="mb-0" />
                </div>
                <div className="flex gap-2">
                    <Skeleton variant="rectangular" width={80} height={32} className="rounded-lg" />
                    <Skeleton variant="rectangular" width={80} height={32} className="rounded-lg" />
                </div>
            </div>

            {/* Gauges Table Placeholder */}
            <div className="page-card shadow-glass overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} variant="text" width={80} className="mb-0" />
                    ))}
                </div>
                <div className="px-6 py-5 flex justify-between gap-4">
                    <Skeleton variant="text" width={70} className="mb-0" />
                    <Skeleton variant="text" width={70} className="mb-0" />
                    <Skeleton variant="text" width={70} className="mb-0" />
                    <Skeleton variant="text" width={70} className="mb-0" />
                    <Skeleton variant="text" width={100} className="mb-0 font-bold" />
                </div>
            </div>
        </div>
    );
}
