"use client";

import React from "react";
import Skeleton from "@/ui/Skeleton";

export function EmployeesTableSkeleton() {
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
                        <Skeleton variant="text" width={120} className="mb-0 font-medium" />
                        <Skeleton variant="text" width={100} className="mb-0" />
                        <Skeleton variant="text" width={100} className="mb-0" />
                        <Skeleton variant="text" width={100} className="mb-0 font-bold" />
                        <Skeleton variant="text" width={80} className="mb-0" />
                    </div>
                ))}
            </div>
        </div>
    );
}
