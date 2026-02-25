"use client";

import React from "react";

interface Tab {
    id: string;
    label: string;
    icon?: string;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (id: string) => void;
}

export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
    return (
        <div className="flex border-b border-border mb-6 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap border-b-2 -mb-[2px] ${
                        activeTab === tab.id
                            ? "border-primary text-primary bg-primary/5"
                            : "border-transparent text-text-muted hover:text-text hover:bg-slate-50"
                    }`}
                >
                    {tab.icon && <i className={`bx ${tab.icon} text-lg`}></i>}
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
