"use client";

import React from "react";
import Skeleton from "@/ui/Skeleton";

export function BenzeneTableSkeleton() {
    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Header Row Placeholder */}
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Skeleton key={i} variant="text" width={60} className="mb-0" />
                ))}
            </div>
            {/* Table Body Placeholder Rows */}
            <div className="divide-y divide-slate-50">
                {[1, 2, 3, 4, 5].map((row) => (
                    <div key={row} className="px-6 py-5 flex justify-between">
                        <Skeleton variant="text" width={40} className="mb-0" />
                        <Skeleton variant="text" width={80} className="mb-0" />
                        <Skeleton variant="text" width={50} className="mb-0" />
                        <Skeleton variant="text" width={50} className="mb-0" />
                        <Skeleton variant="text" width={50} className="mb-0" />
                        <Skeleton variant="text" width={50} className="mb-0" />
                        <Skeleton variant="text" width={60} className="mb-0" />
                        <Skeleton variant="text" width={70} className="mb-0 font-bold" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function BenzenePricesSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-500">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/60 shadow-sm p-5"
                >
                    <div className="h-1.5 w-full bg-slate-100 absolute top-0 left-0"></div>
                    <div className="flex items-center gap-3 mb-4 mt-2">
                        <Skeleton variant="rectangular" width={40} height={40} className="rounded-xl" />
                        <Skeleton variant="text" width={100} className="mb-0" />
                    </div>
                    <div className="flex items-end gap-2">
                        <Skeleton variant="text" width={80} height={32} className="mb-0" />
                        <Skeleton variant="text" width={40} className="mb-1" />
                    </div>
                </div>
            ))}
        </div>
    );
}
