"use client";

import React, { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import { useShiftDiary } from "../hooks/useShiftDiary";
import ShiftDiarySkeleton from "../ui/ShiftDiarySkeleton";
import {
    BenzeneSection,
    SupplyBookSection,
    ExpensesSection,
    StatementSection
} from "./sections/ShiftDiarySections";

export default function ShiftDiaryPage() {
    const t = useTranslations("table.shiftDiary");
    const tPage = useTranslations("shiftDiaryPage");
    const tStatements = useTranslations("shiftDiaryStatements");

    const today = new Date().toISOString().split('T')[0];
    const { summary, isLoading, error, date, setDate, updateNa2lFr2 } = useShiftDiary(today);

    // Memoized save handler to prevent re-renders of StatementSection
    const handleSave = useCallback((statement: string, transfer: number, priceDiff: number, type?: string) => {
        return updateNa2lFr2({ type: type || 'مقبوضات', statement, transfer, priceDiff });
    }, [updateNa2lFr2]);


    return (
        <div className="pb-20">
            <Header titleKey="shiftDiary">
                <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-sm">
                    <span className="text-sm font-medium text-slate-600">{tPage("selectDate")}</span>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>
            </Header>

            <div className="container mx-auto mt-6">
                {error ? (
                    <div className="p-10 text-center">
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 italic">
                            {error}
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 btn-primary"
                        >
                            {tPage("retry")}
                        </button>
                    </div>
                ) : isLoading ? (
                    <ShiftDiarySkeleton />
                ) : summary ? (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Shift Number Summary */}
                        <div className="bg-gradient-to-r from-primary to-primary-dark p-6 rounded-3xl text-white shadow-xl flex justify-between items-center">
                            <div>
                                <p className="text-white/70 text-sm mb-1">{tPage("shiftNumber")}</p>
                                <h2 className="text-4xl font-black">{summary.number}</h2>
                            </div>
                            <div className="text-right">
                                <p className="text-white/70 text-sm mb-1">{tPage("shiftDate")}</p>
                                <p className="text-xl font-bold">{summary.date}</p>
                            </div>
                        </div>

                        {/* Benzene Section */}
                        <BenzeneSection benzene={summary.benzene} t={t} tPage={tPage} />

                        {/* Supply Book Section */}
                        {summary.supplyBook && summary.supplyBook.length > 0 && (
                            <SupplyBookSection supplyBook={summary.supplyBook} t={t} tPage={tPage} />
                        )}

                        {/* Expenses Section */}
                        <ExpensesSection expenses={summary.expenses} tPage={tPage} />

                        {/* Accounts Section */}
                        {summary.accounts && summary.accounts.length > 0 && (
                            <StatementSection
                                title={tPage("accounts")}
                                icon="bx-group"
                                colorClass="text-indigo-600"
                                bgColorClass="bg-indigo-500/10"
                                groups={summary.accounts}
                                onSave={handleSave}
                                tPage={tPage}
                                tStatements={tStatements}
                            />
                        )}

                        {/* Receipts Section */}
                        <StatementSection
                            title={tPage("receipts")}
                            icon="bx-download"
                            colorClass="text-emerald-600"
                            bgColorClass="bg-emerald-500/10"
                            groups={summary.mkbodat}
                            onSave={handleSave}
                            tPage={tPage}
                            tStatements={tStatements}
                            defaultType="مقبوضات"
                        />

                        {/* Payments Section */}
                        <StatementSection
                            title={tPage("payments")}
                            icon="bx-upload"
                            colorClass="text-rose-600"
                            bgColorClass="bg-rose-500/10"
                            groups={summary.mdfo3at}
                            onSave={handleSave}
                            tPage={tPage}
                            tStatements={tStatements}
                            defaultType="مدفوعات"
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                            <i className="bx bx-calendar-x text-5xl"></i>
                        </div>
                        <p className="text-slate-500 font-medium text-lg">{tPage("noDataTitle")} ({date})</p>
                        <p className="text-slate-400 text-sm">{tPage("noDataSubtitle")}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
