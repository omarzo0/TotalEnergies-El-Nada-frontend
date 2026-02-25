"use client";

import Sidebar from "@/components/layout/Sidebar";
import { AuthProvider } from "@/hooks/useAuth";
import { ReactNode } from "react";
import { usePathname } from "@/i18n/routing";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname.includes("/login") ||
        pathname.includes("/forgot-password") ||
        pathname.includes("/reset-password");

    return (
        <AuthProvider>
            <div className="min-h-screen bg-surface">
                {!isAuthPage && <Sidebar />}
                <main className={`${!isAuthPage ? "lg:ms-64" : ""} min-h-screen`}>
                    <div className={`${!isAuthPage ? "p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8" : ""}`}>
                        {children}
                    </div>
                </main>
            </div>
        </AuthProvider>
    );
}
