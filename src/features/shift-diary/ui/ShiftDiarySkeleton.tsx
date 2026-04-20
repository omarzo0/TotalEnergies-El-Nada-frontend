"use client";

import React from "react";
import Skeleton from "@/ui/Skeleton";

export default function ShiftDiarySkeleton() {
    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Shift Number Summary Skeleton */}
            <div className="bg-slate-100 p-6 rounded-3xl flex justify-between items-center border border-slate-200">
                <div className="space-y-2">
                    <Skeleton variant="text" width={80} className="bg-slate-200" />
                    <Skeleton variant="rectangular" width={120} height={40} className="bg-slate-200 rounded-xl" />
                </div>
                <div className="text-right space-y-2 flex flex-col items-end">
                    <Skeleton variant="text" width={80} className="bg-slate-200" />
                    <Skeleton variant="rectangular" width={150} height={28} className="bg-slate-200 rounded-lg" />
                </div>
            </div>

            {/* Benzene Section Skeleton */}
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <Skeleton variant="rectangular" width={40} height={40} className="rounded-xl" />
                    <Skeleton variant="text" width={150} height={24} className="mb-0" />
                </div>
                <div className="page-card overflow-hidden !p-0 shadow-sm border border-slate-100">
                    <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} variant="text" width={80} className="mb-0" />
                        ))}
                    </div>
                    <div className="divide-y divide-slate-50">
                        {[1, 2, 3, 4].map((row) => (
                            <div key={row} className="px-6 py-6 flex justify-between">
                                <Skeleton variant="text" width={60} className="mb-0" />
                                <Skeleton variant="rectangular" width={80} height={24} className="rounded-full mb-0" />
                                <Skeleton variant="text" width={60} className="mb-0" />
                                <Skeleton variant="text" width={60} className="mb-0" />
                                <Skeleton variant="text" width={60} className="mb-0 font-bold" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Receipts/Payments Section Skeleton */}
            {[1, 2].map((section) => (
                <section key={section}>
                    <div className="flex items-center gap-3 mb-4">
                        <Skeleton variant="rectangular" width={40} height={40} className="rounded-xl" />
                        <Skeleton variant="text" width={120} height={24} className="mb-0" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {[1, 2].map((card) => (
                            <div key={card} className="page-card shadow-sm border border-slate-100 flex flex-col h-[280px]">
                                <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
                                    <Skeleton variant="text" width={140} height={20} className="mb-0" />
                                    <Skeleton variant="rectangular" width={40} height={40} className="rounded-xl" />
                                </div>
                                <div className="flex-grow space-y-4">
                                    {[1, 2, 3].map((entry) => (
                                        <div key={entry} className="flex justify-between items-center p-3 rounded-xl bg-slate-50/50">
                                            <Skeleton variant="text" width={100} className="mb-0" />
                                            <Skeleton variant="text" width={80} className="mb-0" />
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-center px-2">
                                    <Skeleton variant="text" width={120} className="mb-0" />
                                    <Skeleton variant="text" width={100} height={24} className="mb-0" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
