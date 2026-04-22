"use client";

import React, { useEffect } from "react";
import { useSupport } from "../hooks/useSupport";
import { useRouter } from "@/i18n/routing";

export default function WarningNotification() {
    const { warnings, isLoadingWarnings, refetchWarnings } = useSupport();
    const router = useRouter();

    // Re-fetch every 30 seconds to keep warnings fresh
    useEffect(() => {
        const interval = setInterval(() => {
            refetchWarnings();
        }, 30000);
        return () => clearInterval(interval);
    }, [refetchWarnings]);

    if (isLoadingWarnings || warnings.length === 0) return null;

    const criticalCount = warnings.filter(w => w.severity === 'critical').length;
    const totalCount = warnings.length;

    return (
        <button
            onClick={() => router.push("/settings?tab=station_warnings")}
            className={`relative flex items-center justify-center p-2 rounded-xl transition-all duration-300
                ${criticalCount > 0
                    ? "bg-red-50 text-red-500 animate-pulse hover:bg-red-100"
                    : "bg-amber-50 text-amber-500 hover:bg-amber-100"}`}
            title={`${totalCount} Active Warnings`}
        >
            <i className={`bx ${criticalCount > 0 ? 'bx-error' : 'bx-bell'} text-xl`}></i>
            <span className={`absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full border-2 border-white
                ${criticalCount > 0 ? "bg-red-500 text-white" : "bg-amber-500 text-white"}`}>
                {totalCount}
            </span>
        </button>
    );
}
