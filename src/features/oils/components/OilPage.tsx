"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Modal from "@/components/shared/Modal";
import Button from "@/ui/Button";
import { Input } from "@/ui/Input";
import { useOils } from "../hooks/useOils";
import OilSalesTab from "./OilSalesTab";
import OilInventoryTab from "./OilInventoryTab";

type OilTab = 'sales' | 'inventory';

export default function OilPage() {
    const t = useTranslations("oils");
    const tButtons = useTranslations("buttons");
    const tPages = useTranslations("pages");
    const tBenzene = useTranslations("benzene"); // Reusing date label

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [activeTab, setActiveTab] = useState<OilTab>("sales");
    const [isAddOilOpen, setIsAddOilOpen] = useState(false);

    const { oils, isLoading: isOilsLoading, addOil } = useOils();
    const [oilFormData, setOilFormData] = useState({
        oilName: "",
        price: 0
    });

    const handleAddOil = async (e: React.FormEvent) => {
        e.preventDefault();
        await addOil({
            ...oilFormData,
            date: selectedDate
        });
        setIsAddOilOpen(false);
        setOilFormData({ oilName: "", price: 0 });
    };

    const tabs: { key: OilTab; label: string; icon: string }[] = [
        { key: "sales", label: tPages("oilShift"), icon: "bx-receipt" },
        { key: "inventory", label: tPages("oilStorage"), icon: "bx-package" }
    ];

    return (
        <div className="pb-10">
            <Header titleKey="oilManagement" />

            {/* Global Date Filter Always Visible */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                                ${activeTab === tab.key
                                    ? "bg-primary text-white shadow-md shadow-primary/25"
                                    : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                }`}
                        >
                            <i className={`bx ${tab.icon} text-lg`}></i>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsAddOilOpen(true)}
                        className="btn-secondary flex items-center gap-2 h-[42px]"
                    >
                        <i className="bx bx-plus-circle text-lg"></i>
                        {t("manageOils")}
                    </button>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm h-[42px]">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{tBenzene("pricesTab.date")}:</span>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="page-card">
                {isOilsLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : activeTab === "sales" ? (
                    <OilSalesTab date={selectedDate} oils={oils} />
                ) : (
                    <OilInventoryTab date={selectedDate} oils={oils} />
                )}
            </div>

            {/* Add New Oil Type Modal */}
            <Modal
                isOpen={isAddOilOpen}
                onClose={() => setIsAddOilOpen(false)}
                title={t("addOilTitle")}
            >
                <form onSubmit={handleAddOil} className="space-y-4">
                    <Input
                        label={t("oilNameLabel")}
                        placeholder={t("oilNamePlaceholder")}
                        value={oilFormData.oilName}
                        onChange={(e) => setOilFormData({ ...oilFormData, oilName: e.target.value })}
                        required
                    />
                    <Input
                        label={t("priceLabel")}
                        type="number"
                        step="0.01"
                        placeholder="150"
                        value={oilFormData.price}
                        onChange={(e) => setOilFormData({ ...oilFormData, price: Number(e.target.value) })}
                        required
                    />
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="secondary" onClick={() => setIsAddOilOpen(false)}>
                            {tButtons("cancel")}
                        </Button>
                        <Button type="submit">
                            {t("addOilButton")}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
