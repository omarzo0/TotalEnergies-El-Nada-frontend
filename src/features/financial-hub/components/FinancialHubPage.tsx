"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import { Input } from "@/ui/Input";
import Button from "@/ui/Button";
import { financialHubApi } from "../api/financial-hub.api";
import { DailyFinancialSummary, PeriodicFinancialReport } from "../types/financial-hub.types";
import { FinancialHubSummarySkeleton, FinancialHubReportSkeleton } from "../ui/FinancialHubSkeleton";

export default function FinancialHubPage() {
    const t = useTranslations("financialHub");
    const tCommon = useTranslations("buttons");

    const [activeTab, setActiveTab] = useState<"summary" | "report">("summary");
    const [summaryDate, setSummaryDate] = useState(new Date().toISOString().split('T')[0]);
    const [reportRange, setReportRange] = useState({
        start: new Date(new Date().setDate(1)).toISOString().split('T')[0], // Start of month
        end: new Date().toISOString().split('T')[0]
    });

    const [summary, setSummary] = useState<DailyFinancialSummary | null>(null);
    const [report, setReport] = useState<PeriodicFinancialReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSummary = async (date: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await financialHubApi.getDailySummary(date);
            setSummary(data);
        } catch (err: any) {
            setError(err.message);
            setSummary(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchReport = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await financialHubApi.getPeriodicReport(reportRange.start, reportRange.end);
            setReport(data);
        } catch (err: any) {
            setError(err.message);
            setReport(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === "summary") {
            fetchSummary(summaryDate);
        }
    }, [summaryDate, activeTab]);

    const tabs = [
        { labelKey: "financialHubSummary", href: "#summary", onClick: () => setActiveTab("summary"), active: activeTab === "summary" },
        { labelKey: "financialHubReport", href: "#report", onClick: () => setActiveTab("report"), active: activeTab === "report" },
    ];

    // Helper to format numbers safely
    const formatNumber = (val: any) => {
        if (typeof val !== 'number') return val || 0;
        return val.toLocaleString();
    };

    // Helper to render metric cards
    const MetricCard = ({ title, value, subtext, icon, variant = "default" }: any) => (
        <div className={`page-card shadow-glass flex flex-col justify-between p-6 h-full ${variant === "primary" ? "bg-primary text-white border-none" : ""}`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl ${variant === "primary" ? "bg-white/10" : "bg-primary/5 text-primary"}`}>
                    <i className={`bx ${icon} text-2xl`}></i>
                </div>
            </div>
            <div>
                <p className={`text-sm ${variant === "primary" ? "text-primary-foreground/70" : "text-text-muted"}`}>{title}</p>
                <h3 className="text-2xl font-black mt-1">
                    {formatNumber(value)}
                    <span className="text-xs ml-1 font-normal opacity-70">EGP</span>
                </h3>
                {subtext && <p className={`text-xs mt-2 ${variant === "primary" ? "text-primary-foreground/60" : "text-text-muted font-medium"}`}>{subtext}</p>}
            </div>
        </div>
    );

    return (
        <div className="pb-10">
            <Header
                titleKey="financialHub"
                tabs={tabs}
            />

            <div className="max-w-6xl mx-auto px-4 mt-6">
                {activeTab === "summary" ? (
                    <div className="space-y-6">
                        <div className="page-card shadow-glass max-w-sm">
                            <Input
                                type="date"
                                label={t("form.selectDate")}
                                value={summaryDate}
                                onChange={(e) => setSummaryDate(e.target.value)}
                            />
                        </div>

                        {loading ? (
                            <FinancialHubSummarySkeleton />
                        ) : summary ? (
                            <div className="space-y-6">
                                {/* Profit & Global Balance Highlight */}
                                <div className="page-card bg-primary text-white shadow-card p-8 flex flex-col md:flex-row justify-between items-center transform hover:scale-[1.01] transition-all">
                                    <div className="text-center md:text-left mb-6 md:mb-0">
                                        <h3 className="text-2xl font-black">{t("dailySummary")}</h3>
                                        <p className="text-primary-foreground/70">{summaryDate}</p>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-8 w-full md:w-auto">
                                        <div className="text-center md:text-right border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-8">
                                            <p className="text-primary-foreground/70 text-xs uppercase tracking-wider font-bold mb-1">{t("metrics.netProfit")}</p>
                                            <div className="text-4xl font-black">
                                                {formatNumber(summary.overview?.netProfit)} <span className="text-sm font-normal opacity-60">EGP</span>
                                            </div>
                                        </div>
                                        <div className="text-center md:text-right">
                                            <p className="text-primary-foreground/70 text-xs uppercase tracking-wider font-bold mb-1">{t("metrics.globalSafeBalance")}</p>
                                            <div className="text-4xl font-black">
                                                {formatNumber(summary.globalBalance)} <span className="text-sm font-normal opacity-60">EGP</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                {/* Main Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <MetricCard
                                        title={t("metrics.fuelRevenue")}
                                        value={summary.fuel?.revenue}
                                        subtext={`${formatNumber(summary.fuel?.liters)} ${t("metrics.liters")}`}
                                        icon="bx-gas-pump"
                                    />
                                    <MetricCard
                                        title={t("metrics.oilRevenue")}
                                        value={summary.oil?.revenue}
                                        subtext={`${formatNumber(summary.oil?.count)} ${t("metrics.transactionCount")}`}
                                        icon="bx-oil-can"
                                    />
                                    <MetricCard
                                        title={t("metrics.receipts")}
                                        value={summary.treasury?.receipts}
                                        icon="bx-trending-up"
                                    />
                                    <MetricCard
                                        title={t("metrics.payments")}
                                        value={summary.treasury?.payments}
                                        icon="bx-trending-down"
                                    />
                                </div>

                                {/* Persistent Safe Metrics */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <MetricCard
                                        title={t("metrics.openingBalance")}
                                        value={summary.openingBalance}
                                        icon="bx-lock-open"
                                        variant="default"
                                    />
                                    <MetricCard
                                        title={t("metrics.closingBalance")}
                                        value={summary.closingBalance}
                                        icon="bx-lock"
                                        variant="primary"
                                        subtext={t("metrics.runningSafe")}
                                    />
                                </div>


                                {/* Secondary Grid: Vouchers, Clients, Island */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <MetricCard
                                        title={t("metrics.vouchers")}
                                        value={summary.vouchers?.total}
                                        subtext={`${formatNumber(summary.vouchers?.count)} ${t("metrics.vouchers")}`}
                                        icon="bx-receipt"
                                    />
                                    <MetricCard
                                        title={t("metrics.clientDebts")}
                                        value={summary.clients?.total}
                                        icon="bx-user-minus"
                                    />
                                    <MetricCard
                                        title={t("metrics.accountsMovement")}
                                        value={summary.accounts?.netMovement}
                                        icon="bx-transfer-alt"
                                    />
                                    <MetricCard
                                        title={t("metrics.islandCash")}
                                        value={summary.island?.totalCash}
                                        icon="bx-money"
                                        variant="default"
                                    />
                                </div>

                                {/* Totals & Liabilities */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <MetricCard
                                        title={t("metrics.totalIn")}
                                        value={summary.overview?.totalIn}
                                        icon="bx-plus-circle"
                                        variant="default"
                                    />
                                    <MetricCard
                                        title={t("metrics.totalOut")}
                                        value={summary.overview?.totalOut}
                                        icon="bx-minus-circle"
                                        variant="default"
                                    />
                                    <MetricCard
                                        title={t("metrics.salaries")}
                                        value={summary.salaries?.monthlyLiability}
                                        subtext={`${formatNumber(summary.salaries?.count)} ${t("metrics.employees")}`}
                                        icon="bx-group"
                                        variant="default"
                                    />
                                </div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 text-red-600 p-8 rounded-3xl text-center border border-red-100">
                                <i className="bx bx-error-circle text-4xl mb-2"></i>
                                <p>{error}</p>
                            </div>
                        ) : (
                            <div className="page-card shadow-glass p-20 text-center opacity-50">
                                {t("noData")}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="page-card shadow-glass p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                                <Input
                                    type="date"
                                    label={t("form.startDate")}
                                    value={reportRange.start}
                                    onChange={(e) => setReportRange({ ...reportRange, start: e.target.value })}
                                />
                                <Input
                                    type="date"
                                    label={t("form.endDate")}
                                    value={reportRange.end}
                                    onChange={(e) => setReportRange({ ...reportRange, end: e.target.value })}
                                />
                                <Button onClick={fetchReport} className="w-full h-[52px]">
                                    {t("form.generateReport")}
                                </Button>
                            </div>
                        </div>

                        {loading ? (
                            <FinancialHubReportSkeleton />
                        ) : report ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Periodic Profit Highlight */}
                                <div className="page-card bg-emerald-600 text-white shadow-card p-10 flex flex-col md:flex-row justify-between items-center rounded-[32px]">
                                    <div className="text-center md:text-left">
                                        <h3 className="text-2xl font-black">{t("metrics.netProfit")}</h3>
                                        <p className="text-white/70 font-medium">Period: {report.period.start} to {report.period.end}</p>
                                    </div>
                                    <div className="text-6xl font-black mt-4 md:mt-0 tracking-tighter">
                                        {formatNumber(report.netProfit)} <span className="text-xl font-normal opacity-70">EGP</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="page-card shadow-glass p-8 group hover:border-primary/30 transition-colors">
                                        <h4 className="text-text-muted text-sm font-bold uppercase tracking-widest mb-4">{t("metrics.fuelRevenue")}</h4>
                                        <div className="text-3xl font-black text-slate-800">{formatNumber(report.fuelRevenue)} <span className="text-sm font-medium opacity-40">EGP</span></div>
                                    </div>
                                    <div className="page-card shadow-glass p-8 group hover:border-primary/30 transition-colors">
                                        <h4 className="text-text-muted text-sm font-bold uppercase tracking-widest mb-4">{t("metrics.oilRevenue")}</h4>
                                        <div className="text-3xl font-black text-slate-800">{formatNumber(report.oilRevenue)} <span className="text-sm font-medium opacity-40">EGP</span></div>
                                    </div>
                                    <div className="page-card shadow-glass p-8 group hover:border-primary/30 transition-colors">
                                        <h4 className="text-text-muted text-sm font-bold uppercase tracking-widest mb-4">{t("metrics.expenses")}</h4>
                                        <div className="text-3xl font-black text-danger">{formatNumber(report.expenses)} <span className="text-sm font-medium opacity-40">EGP</span></div>
                                    </div>
                                    <div className="page-card shadow-glass p-8 group hover:border-primary/30 transition-colors">
                                        <h4 className="text-text-muted text-sm font-bold uppercase tracking-widest mb-4">{t("metrics.vouchers")}</h4>
                                        <div className="text-3xl font-black text-slate-800">{formatNumber(report.vouchers)} <span className="text-sm font-medium opacity-40">EGP</span></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="page-card shadow-glass p-8 border-l-4 border-l-emerald-500">
                                        <h4 className="text-text-muted text-sm font-bold uppercase tracking-widest mb-4">{t("metrics.totalIn")}</h4>
                                        <div className="text-4xl font-black text-emerald-600">{formatNumber(report.totalIn)} <span className="text-sm font-medium opacity-40">EGP</span></div>
                                    </div>
                                    <div className="page-card shadow-glass p-8 border-l-4 border-l-red-500">
                                        <h4 className="text-text-muted text-sm font-bold uppercase tracking-widest mb-4">{t("metrics.totalOut")}</h4>
                                        <div className="text-4xl font-black text-red-600">{formatNumber(report.totalOut)} <span className="text-sm font-medium opacity-40">EGP</span></div>
                                    </div>
                                    <div className="page-card shadow-glass p-8 border-l-4 border-l-blue-500">
                                        <h4 className="text-text-muted text-sm font-bold uppercase tracking-widest mb-4">{t("metrics.openingBalance")}</h4>
                                        <div className="text-4xl font-black text-blue-600">{formatNumber(report.openingBalance)} <span className="text-sm font-medium opacity-40">EGP</span></div>
                                    </div>
                                    <div className="page-card shadow-glass p-8 border-l-4 border-l-indigo-500">
                                        <h4 className="text-text-muted text-sm font-bold uppercase tracking-widest mb-4">{t("metrics.closingBalance")}</h4>
                                        <div className="text-4xl font-black text-indigo-600">{formatNumber(report.closingBalance)} <span className="text-sm font-medium opacity-40">EGP</span></div>
                                    </div>
                                </div>

                            </div>
                        ) : error ? (
                            <div className="bg-red-50 text-red-600 p-8 rounded-3xl text-center border border-red-100">
                                <i className="bx bx-error-circle text-4xl mb-2"></i>
                                <p>{error}</p>
                            </div>
                        ) : (
                            <div className="page-card shadow-glass p-20 text-center opacity-50">
                                {t("noData")}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div >
    );
}
