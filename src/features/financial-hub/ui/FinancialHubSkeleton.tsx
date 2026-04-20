"use client";

import React from "react";
import Skeleton from "@/ui/Skeleton";

export function FinancialHubSummarySkeleton() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Profit Highlight Placeholder */}
            <div className="page-card bg-slate-200 border-none shadow-card p-8 flex flex-col md:flex-row justify-between items-center h-[140px]">
                <div className="space-y-2">
                    <Skeleton variant="text" width={150} className="bg-slate-300" />
                    <Skeleton variant="text" width={100} className="bg-slate-300" />
                </div>
                <Skeleton variant="text" width={200} height={48} className="bg-slate-300" />
            </div>

            {/* Metric Grids Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="page-card shadow-glass p-6 h-[180px] flex flex-col justify-between">
                        <Skeleton variant="circular" width={40} height={40} />
                        <div className="space-y-2">
                            <Skeleton variant="text" width={120} />
                            <Skeleton variant="text" width={150} height={32} />
                            <Skeleton variant="text" width={100} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="page-card shadow-glass p-6 h-[180px] flex flex-col justify-between">
                        <Skeleton variant="circular" width={40} height={40} />
                        <div className="space-y-2">
                            <Skeleton variant="text" width={120} />
                            <Skeleton variant="text" width={150} height={32} />
                            <Skeleton variant="text" width={100} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="page-card shadow-glass p-6 h-[180px] flex flex-col justify-between">
                        <Skeleton variant="circular" width={40} height={40} />
                        <div className="space-y-2">
                            <Skeleton variant="text" width={120} />
                            <Skeleton variant="text" width={150} height={32} />
                            <Skeleton variant="text" width={100} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function FinancialHubReportSkeleton() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Periodic Profit Highlight Placeholder */}
            <div className="page-card bg-slate-200 border-none shadow-card p-10 flex flex-col md:flex-row justify-between items-center h-[160px]">
                <div className="space-y-2">
                    <Skeleton variant="text" width={150} className="bg-slate-300" />
                    <Skeleton variant="text" width={180} className="bg-slate-300" />
                </div>
                <Skeleton variant="text" width={220} height={60} className="bg-slate-300" />
            </div>

            {/* Periodic Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="page-card shadow-glass p-8 h-[140px] flex flex-col justify-center">
                        <Skeleton variant="text" width={100} className="mb-4" />
                        <Skeleton variant="text" width={150} height={32} />
                    </div>
                ))}
            </div>

            {/* Periodic Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="page-card shadow-glass p-8 border-l-4 border-slate-200 h-[140px] flex flex-col justify-center">
                        <Skeleton variant="text" width={100} className="mb-4" />
                        <Skeleton variant="text" width={180} height={40} />
                    </div>
                ))}
            </div>
        </div>
    );
}
