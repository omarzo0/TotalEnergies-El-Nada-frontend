"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import Image from "next/image";
import { NavItem } from "@/types";

import { usePermissions } from "@/features/auth/hooks/usePermissions";

const navItems: NavItem[] = [
    { key: "overview", href: "/overview", icon: "bxs-home" }, // Everyone can see overview
    { key: "shiftDiary", href: "/shift-diary", icon: "bxs-book-add", resource: 'shiftDiary', action: 'read' },
    { key: "benzene", href: "/benzene", icon: "bx-gas-pump", resource: 'benzene', action: 'read' },
    { key: "oils", href: "/oils/shift", icon: "bx-folder-plus", resource: 'oil', action: 'read' },
    { key: "expenses", href: "/expenses", icon: "bx-folder-plus", resource: 'expense', action: 'read' },
    { key: "vouchers", href: "/vouchers/list", icon: "bxs-file-plus", resource: 'voucher', action: 'read' },
    { key: "deferredClients", href: "/deferred-clients", icon: "bx-comment-error", resource: 'termClient', action: 'read' },
    { key: "dailyTreasury", href: "/daily-treasury", icon: "bx-calendar-check", resource: 'dailyTreasury', action: 'read' },
    { key: "supplyBook", href: "/supply-book/records", icon: "bx-cog", resource: 'supplyBook', action: 'read' },
    { key: "treasuryMovement", href: "/treasury-movement", icon: "bx-cog", resource: 'treasuryMovement', action: 'read' },
    { key: "employees", href: "/employees", icon: "bx-cog", resource: 'employee', action: 'read' },
    { key: "systemLog", href: "/system-log", icon: "bx-cog", resource: 'log', action: 'read' },
    { key: "financialHub", href: "/financial-hub", icon: "bx-calculator", resource: 'financial', action: 'read' },
    { key: "statements", href: "/statements", icon: "bx-list-check", resource: 'statement', action: 'read' },
    { key: "settings", href: "/settings", icon: "bx-cog", resource: 'account', action: 'read' },
];

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const t = useTranslations("sidebar");
    const tApp = useTranslations("app");
    const { can } = usePermissions();

    const filteredNavItems = navItems.filter(item => {
        if (!item.resource) return true;
        return can(item.resource, item.action || 'read');
    });

    const isActive = (href: string) => {
        if (href === "/overview") return pathname === "/overview";
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Hamburger toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 start-4 z-50 lg:hidden bg-primary text-white p-2 rounded-lg shadow-elevated"
            >
                <i className={`bx ${isOpen ? "bx-x" : "bx-menu"} text-xl`}></i>
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 start-0 h-full w-64 bg-sidebar z-50 shadow-sidebar transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"} lg:translate-x-0 rtl:lg:translate-x-0`}
            >
                {/* Logo */}
                <div className="p-4 border-b border-white/10 flex-shrink-0">
                    <div className="relative w-full h-24 bg-white/5 rounded-2xl overflow-hidden flex items-center justify-center p-2 backdrop-blur-sm border border-white/5">
                        <span className="text-2xl font-black text-white tracking-tight">Petro<span className="text-primary-light">Desk</span></span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-hidden">
                    <ul className="space-y-1">
                        {filteredNavItems.map((item) => (
                            <li key={item.key}>
                                <Link
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`sidebar-link ${isActive(item.href) ? "active" : ""}`}
                                >
                                    <i className={`bx ${item.icon} text-lg`}></i>
                                    <span className="text-sm">{t(item.key)}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Logout */}
                <div className="p-3 border-t border-white/10 flex-shrink-0">
                    <Link
                        href="/login"
                        className="sidebar-link text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                        <i className="bx bx-log-out text-lg"></i>
                        <span className="text-sm">{tApp("logout")}</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}
