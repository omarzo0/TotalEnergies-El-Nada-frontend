"use client";

import React from "react";
import Skeleton from "@/ui/Skeleton";

export function AccountSettingsSkeleton() {
    return (
        <div className="space-y-6 max-w-2xl animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton variant="text" width={80} className="mb-1" />
                        <Skeleton variant="text" width="100%" height={48} className="rounded-2xl" />
                    </div>
                ))}
                <div className="space-y-2">
                    <Skeleton variant="text" width={80} className="mb-1" />
                    <Skeleton variant="text" width="100%" height={48} className="rounded-2xl" />
                </div>
            </div>
            <div className="flex justify-end pt-4">
                <Skeleton variant="text" width={100} height={42} className="rounded-xl" />
            </div>
        </div>
    );
}

export function AdminManagementSkeleton() {
    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Header Placeholder */}
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} variant="text" width={100} className="mb-0" />
                ))}
            </div>
            {/* Table Body Rows Placeholder */}
            <div className="divide-y divide-slate-50">
                {[1, 2, 3, 4, 5].map((row) => (
                    <div key={row} className="px-6 py-5 flex justify-between gap-4">
                        <Skeleton variant="text" width={150} className="mb-0 font-medium" />
                        <Skeleton variant="text" width={180} className="mb-0" />
                        <Skeleton variant="text" width={100} className="mb-0" />
                        <Skeleton variant="text" width={120} className="mb-0 font-bold" />
                    </div>
                ))}
            </div>
        </div>
    );
}
