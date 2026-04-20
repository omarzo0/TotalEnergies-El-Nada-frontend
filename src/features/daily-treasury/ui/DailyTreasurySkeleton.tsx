"use client";

import React from "react";
import Skeleton from "@/ui/Skeleton";

export function DailyTreasurySkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {/* Main Analytics Section Skeleton */}
            <div className="lg:col-span-2 space-y-6">
                {/* Summary Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-5 rounded-2xl border border-slate-100 flex flex-col gap-2">
                            <Skeleton variant="circular" width={24} height={24} className="mb-1" />
                            <Skeleton variant="text" width={100} height={32} className="mb-0" />
                            <Skeleton variant="text" width={80} className="mb-0 opacity-70" />
                        </div>
                    ))}
                </div>

                {/* Fuel Breakdown Grid Skeleton */}
                <div className="page-card">
                    <div className="flex items-center gap-2 mb-4">
                        <Skeleton variant="circular" width={20} height={20} />
                        <Skeleton variant="text" width={120} height={24} className="mb-0" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                                <Skeleton variant="text" width={60} className="mb-0" />
                                <Skeleton variant="text" width={100} height={28} className="mb-0" />
                                <div className="flex justify-between">
                                    <Skeleton variant="text" width={40} className="mb-0" />
                                    <Skeleton variant="text" width={40} className="mb-0" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary highlights Skeleton */}
                <div className="page-card">
                    <div className="flex items-center gap-2 mb-4">
                        <Skeleton variant="circular" width={20} height={20} />
                        <Skeleton variant="text" width={140} height={24} className="mb-0" />
                    </div>
                    <div className="divide-y">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex justify-between items-center py-4">
                                <div className="space-y-1">
                                    <Skeleton variant="text" width={80} className="mb-0" />
                                    <Skeleton variant="text" width={100} className="mb-0" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Skeleton variant="text" width={80} height={24} className="mb-0" />
                                    <Skeleton variant="rectangular" width={32} height={32} className="rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Manual Entries Table Skeleton */}
                <div className="page-card">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <Skeleton variant="circular" width={20} height={20} />
                            <Skeleton variant="text" width={120} height={24} className="mb-0" />
                        </div>
                        <Skeleton variant="rectangular" width={80} height={32} className="rounded-lg" />
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between px-4 py-2 bg-slate-50 rounded-lg">
                            {[1, 2, 3, 4].map(i => <Skeleton key={i} variant="text" width={60} className="mb-0" />)}
                        </div>
                        {[1, 2, 3].map(row => (
                            <div key={row} className="flex justify-between px-4 py-2">
                                <Skeleton variant="text" width={100} className="mb-0" />
                                <Skeleton variant="text" width={50} className="mb-0" />
                                <Skeleton variant="text" width={50} className="mb-0" />
                                <Skeleton variant="text" width={60} className="mb-0" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-6">
                {/* Oil Sales Detail Skeleton */}
                <div className="page-card border-slate-100">
                    <Skeleton variant="text" width={80} className="mb-3" />
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <Skeleton variant="text" width={120} height={32} className="mb-0" />
                            <Skeleton variant="text" width={80} className="mb-0" />
                        </div>
                        <Skeleton variant="rectangular" width={70} height={20} className="rounded-full" />
                    </div>
                </div>

                {/* Deductions Card Skeleton */}
                <div className="page-card bg-slate-50/50">
                    <div className="flex items-center gap-2 mb-4">
                        <Skeleton variant="circular" width={20} height={20} />
                        <Skeleton variant="text" width={100} height={24} className="mb-0" />
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex justify-between">
                                <div className="space-y-1">
                                    <Skeleton variant="text" width={70} className="mb-0" />
                                    <Skeleton variant="text" width={40} className="mb-0" />
                                </div>
                                <Skeleton variant="text" width={60} className="mb-0" />
                            </div>
                        ))}
                        <div className="pt-4 border-t border-slate-200 mt-4 flex justify-between">
                            <Skeleton variant="text" width={100} className="mb-0" />
                            <Skeleton variant="text" width={80} className="mb-0" />
                        </div>
                    </div>
                </div>

                {/* Safe Totals Card Skeleton */}
                <div className="page-card bg-primary/5 border-primary/10">
                    <Skeleton variant="text" width={80} className="mb-1" />
                    <Skeleton variant="text" width={180} height={48} className="mb-0" />
                    <div className="mt-4 pt-4 border-t border-primary/10 space-y-2">
                        <div className="flex justify-between">
                            <Skeleton variant="text" width={60} className="mb-0" />
                            <Skeleton variant="text" width={100} className="mb-0" />
                        </div>
                        <Skeleton variant="text" width={180} className="mb-0" />
                    </div>
                </div>
            </div>
        </div>
    );
}
