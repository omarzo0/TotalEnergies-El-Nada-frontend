"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import { useShiftDiary } from "../hooks/useShiftDiary";
import Na2lFr2Editor from "./Na2lFr2Editor";
import ShiftDiarySkeleton from "../ui/ShiftDiarySkeleton";

export default function ShiftDiaryPage() {
    const t = useTranslations("table.shiftDiary");
    const tPage = useTranslations("shiftDiaryPage");
    const tButtons = useTranslations("buttons");
    const tStatements = useTranslations("shiftDiaryStatements");


    const today = new Date().toISOString().split('T')[0];
    const { summary, isLoading, error, date, setDate, updateNa2lFr2 } = useShiftDiary(today);

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
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                                    <i className="bx bx-gas-pump text-2xl"></i>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">{tPage("pumpReadings")}</h3>
                            </div>
                            <div className="page-card overflow-hidden !p-0 shadow-glass border-none">
                                <table className="w-full text-right border-collapse">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 text-sm font-bold text-slate-600">{t("pumpNumber")}</th>
                                            <th className="px-6 py-4 text-sm font-bold text-slate-600">{t("type")}</th>
                                            <th className="px-6 py-4 text-sm font-bold text-slate-600">{t("start")}</th>
                                            <th className="px-6 py-4 text-sm font-bold text-slate-600">{t("end")}</th>
                                            <th className="px-6 py-4 text-sm font-bold text-slate-600">{t("total")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {summary.benzene?.map((b, i) => (
                                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 text-slate-700 font-medium">{b.trumbaNumber}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                                                        {b.trumbaType}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">{b.start}</td>
                                                <td className="px-6 py-4 text-slate-600">{b.end}</td>
                                                <td className="px-6 py-4 font-bold text-primary">{b.total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Supply Book Section */}
                        {summary.supplyBook && summary.supplyBook.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                                        <i className="bx bx-book-content text-2xl"></i>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">{tPage("supplyBook")}</h3>
                                </div>
                                <div className="page-card overflow-hidden !p-0 shadow-glass border-none">
                                    <table className="w-full text-right border-collapse">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-4 text-sm font-bold text-slate-600">{t("benzType")}</th>
                                                <th className="px-6 py-4 text-sm font-bold text-slate-600">{t("start")}</th>
                                                <th className="px-6 py-4 text-sm font-bold text-slate-600">{t("incoming")}</th>
                                                <th className="px-6 py-4 text-sm font-bold text-slate-600">{t("dispensed")}</th>
                                                <th className="px-6 py-4 text-sm font-bold text-slate-600">{t("pumps")}</th>
                                                <th className="px-6 py-4 text-sm font-bold text-slate-600">{t("end")}</th>
                                                <th className="px-6 py-4 text-sm font-bold text-slate-600">{t("standard")}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {summary.supplyBook.map((s, i) => (
                                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-bold">
                                                            {s.benzType}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600 font-medium">{s.start.toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-slate-600">{s.incoming.toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-slate-600">{s.dispensed.toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-slate-600">{s.pumps}</td>
                                                    <td className="px-6 py-4 text-slate-600 font-medium">{s.end.toLocaleString()}</td>
                                                    <td className="px-6 py-4 font-bold text-purple-600">{s.standard.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}
                        {/* Expenses Section */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                                    <i className="bx bx-receipt text-2xl"></i>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">{tPage("expenses")}</h3>
                            </div>
                            <div className="page-card shadow-glass border-none">
                                <div className="space-y-2">
                                    {summary.expenses?.map((e, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                            <span className="text-slate-600 text-sm">{e.receiptName}</span>
                                            <span className="font-bold text-slate-800">{e.money.toLocaleString()} {tPage("currency")}</span>
                                        </div>
                                    ))}
                                    {(!summary.expenses || summary.expenses.length === 0) && (
                                        <p className="text-center py-4 text-slate-400 text-sm italic">{tPage("noEntries")}</p>
                                    )}
                                </div>
                                {summary.expenses && summary.expenses.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center px-2">
                                        <span className="text-sm font-medium text-slate-500">{tPage("totalExpenses")}</span>
                                        <span className="text-lg font-black text-orange-600">
                                            {summary.expenses.reduce((sum, e) => sum + e.money, 0).toLocaleString()} {tPage("currency")}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Accounts Section */}
                        {summary.accounts && summary.accounts.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                                        <i className="bx bx-group text-2xl"></i>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">{tPage("accounts")}</h3>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {summary.accounts.map((group, idx) => (
                                        <div key={idx} className="page-card shadow-glass border-none flex flex-col h-full">
                                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                                                <h4 className="font-bold text-slate-800 text-lg">
                                                    {tStatements.has(group.statement) ? tStatements(group.statement as any) : group.statement}
                                                </h4>

                                                <Na2lFr2Editor
                                                    initialNa2l={group.na2l}
                                                    initialFr2s3r={group.fr2s3r}
                                                    onSave={(na2l, fr2s3r) => updateNa2lFr2(group.originalType || 'مقبوضات', group.statement, na2l, fr2s3r)}
                                                />
                                            </div>
                                            <div className="flex-grow space-y-2 mb-4">
                                                {group.entries.map((entry, eIdx) => (
                                                    <div key={eIdx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                                        <span className="text-slate-600 text-sm">{entry.sand}</span>
                                                        <span className="font-bold text-slate-800">{entry.money.toLocaleString()} {tPage("currency")}</span>
                                                    </div>
                                                ))}
                                                {group.entries.length === 0 && (
                                                    <p className="text-center py-4 text-slate-400 text-sm italic">{tPage("noEntries")}</p>
                                                )}
                                            </div>
                                            <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-center px-2">
                                                <span className="text-sm font-medium text-slate-500">
                                                    {tPage("totalOf")} {tStatements.has(group.statement) ? tStatements(group.statement as any) : group.statement}
                                                </span>

                                                <span className="text-lg font-black text-indigo-600">{group.total.toLocaleString()} {tPage("currency")}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Receipts Section */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                                    <i className="bx bx-download text-2xl"></i>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">{tPage("receipts")}</h3>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {summary.mkbodat?.map((group, idx) => (
                                    <div key={idx} className="page-card shadow-glass border-none flex flex-col h-full">
                                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                                            <h4 className="font-bold text-slate-800 text-lg">
                                                {tStatements.has(group.statement) ? tStatements(group.statement as any) : group.statement}
                                            </h4>

                                            <Na2lFr2Editor
                                                initialNa2l={group.na2l}
                                                initialFr2s3r={group.fr2s3r}
                                                onSave={(na2l, fr2s3r) => updateNa2lFr2('مقبوضات', group.statement, na2l, fr2s3r)}
                                            />
                                        </div>
                                        <div className="flex-grow space-y-2 mb-4">
                                            {group.entries.map((entry, eIdx) => (
                                                <div key={eIdx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                                    <span className="text-slate-600 text-sm">{entry.sand}</span>
                                                    <span className="font-bold text-slate-800">{entry.money.toLocaleString()} {tPage("currency")}</span>
                                                </div>
                                            ))}
                                            {group.entries.length === 0 && (
                                                <p className="text-center py-4 text-slate-400 text-sm italic">{tPage("noEntries")}</p>
                                            )}
                                        </div>
                                        <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-center px-2">
                                            <span className="text-sm font-medium text-slate-500">
                                                {tPage("totalOf")} {tStatements.has(group.statement) ? tStatements(group.statement as any) : group.statement}
                                            </span>

                                            <span className="text-lg font-black text-emerald-600">{group.total.toLocaleString()} {tPage("currency")}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Payments Section */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                                    <i className="bx bx-upload text-2xl"></i>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">{tPage("payments")}</h3>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {summary.mdfo3at?.map((group, idx) => (
                                    <div key={idx} className="page-card shadow-glass border-none flex flex-col h-full">
                                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                                            <h4 className="font-bold text-slate-800 text-lg">
                                                {tStatements.has(group.statement) ? tStatements(group.statement as any) : group.statement}
                                            </h4>

                                            <Na2lFr2Editor
                                                initialNa2l={group.na2l}
                                                initialFr2s3r={group.fr2s3r}
                                                onSave={(na2l, fr2s3r) => updateNa2lFr2('مدفوعات', group.statement, na2l, fr2s3r)}
                                            />
                                        </div>
                                        <div className="flex-grow space-y-2 mb-4">
                                            {group.entries.map((entry, eIdx) => (
                                                <div key={eIdx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                                    <span className="text-slate-600 text-sm">{entry.sand}</span>
                                                    <span className="font-bold text-slate-800">{entry.money.toLocaleString()} {tPage("currency")}</span>
                                                </div>
                                            ))}
                                            {group.entries.length === 0 && (
                                                <p className="text-center py-4 text-slate-400 text-sm italic">{tPage("noEntries")}</p>
                                            )}
                                        </div>
                                        <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-center px-2">
                                            <span className="text-sm font-medium text-slate-500">
                                                {tPage("totalOf")} {tStatements.has(group.statement) ? tStatements(group.statement as any) : group.statement}
                                            </span>

                                            <span className="text-lg font-black text-rose-600">{group.total.toLocaleString()} {tPage("currency")}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
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
