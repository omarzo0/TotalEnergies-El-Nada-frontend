"use client";

import React from "react";
import Skeleton from "@/ui/Skeleton";

export function VoucherListSkeleton() {
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
                        <Skeleton variant="text" width={100} className="mb-0" />
                        <Skeleton variant="text" width={60} className="mb-0" />
                        <Skeleton variant="text" width={60} className="mb-0" />
                        <Skeleton variant="text" width={40} className="mb-0" />
                        <Skeleton variant="text" width={60} className="mb-0" />
                        <Skeleton variant="text" width={80} className="mb-0 font-bold" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function VoucherMatchingSkeleton() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Summary Header Placeholder */}
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <Skeleton variant="text" width={140} height={24} className="mb-0" />
                <div className="text-right space-y-1">
                    <Skeleton variant="text" width={60} className="mb-0 ml-auto" />
                    <Skeleton variant="text" width={100} height={32} className="mb-0" />
                </div>
            </div>

            {/* Matching Table Placeholder */}
            <div className="space-y-4">
                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} variant="text" width={80} className="mb-0" />
                    ))}
                </div>
                <div className="divide-y divide-slate-50">
                    {[1, 2, 3, 4].map((row) => (
                        <div key={row} className="px-6 py-5 flex justify-between gap-4">
                            <Skeleton variant="text" width={60} className="mb-0" />
                            <Skeleton variant="text" width={60} className="mb-0" />
                            <Skeleton variant="text" width={80} className="mb-0 font-bold" />
                            <Skeleton variant="text" width={60} className="mb-0" />
                            <Skeleton variant="text" width={100} className="mb-0" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
