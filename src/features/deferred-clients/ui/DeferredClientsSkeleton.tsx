"use client";

import React from "react";
import Skeleton from "@/ui/Skeleton";

export function DeferredClientsSummarySkeleton() {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-glass flex items-center justify-between animate-in fade-in duration-500">
            <div className="space-y-2">
                <Skeleton variant="text" width={100} className="mb-0" />
                <Skeleton variant="text" width={150} height={36} className="mb-0" />
            </div>
            <Skeleton variant="rectangular" width={56} height={56} className="rounded-2xl" />
        </div>
    );
}

export function DeferredClientsTableSkeleton() {
    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Header Row Placeholder */}
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} variant="text" width={80} className="mb-0" />
                ))}
            </div>
            {/* Table Body Placeholder Rows */}
            <div className="divide-y divide-slate-50">
                {[1, 2, 3, 4, 5].map((row) => (
                    <div key={row} className="px-6 py-5 flex justify-between gap-4">
                        <Skeleton variant="text" width={60} className="mb-0" />
                        <Skeleton variant="text" width={60} className="mb-0" />
                        <Skeleton variant="text" width={100} className="mb-0" />
                        <Skeleton variant="text" width={80} className="mb-0" />
                        <Skeleton variant="text" width={120} className="mb-0 font-bold" />
                    </div>
                ))}
            </div>
        </div>
    );
}
