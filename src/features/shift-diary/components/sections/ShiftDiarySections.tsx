"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import Na2lFr2Editor from '../Na2lFr2Editor';
import { BenzeneReading, SupplyBookEntry, ExpenseReading, StatementSummary } from '../../types/shift-diary.types';

interface SectionProps {
    tPage: any;
    t: any;
    tStatements: any;
}

// 1. Benzene Section
export const BenzeneSection = React.memo(({ benzene, t, tPage }: { benzene: BenzeneReading[]; t: any; tPage: any }) => (
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
                    {benzene?.map((b, i) => (
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
));

BenzeneSection.displayName = 'BenzeneSection';

// 2. Supply Book Section
export const SupplyBookSection = React.memo(({ supplyBook, t, tPage }: { supplyBook: SupplyBookEntry[]; t: any; tPage: any }) => (
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
                    {supplyBook.map((s, i) => (
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
));

SupplyBookSection.displayName = 'SupplyBookSection';

// 3. Expenses Section
export const ExpensesSection = React.memo(({ expenses, tPage }: { expenses: ExpenseReading[]; tPage: any }) => (
    <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                <i className="bx bx-receipt text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800">{tPage("expenses")}</h3>
        </div>
        <div className="page-card shadow-glass border-none">
            <div className="space-y-2">
                {expenses?.map((e, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <span className="text-slate-600 text-sm">{e.receiptName}</span>
                        <span className="font-bold text-slate-800">{e.money.toLocaleString()} {tPage("currency")}</span>
                    </div>
                ))}
                {(!expenses || expenses.length === 0) && (
                    <p className="text-center py-4 text-slate-400 text-sm italic">{tPage("noEntries")}</p>
                )}
            </div>
            {expenses && expenses.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center px-2">
                    <span className="text-sm font-medium text-slate-500">{tPage("totalExpenses")}</span>
                    <span className="text-lg font-black text-orange-600">
                        {expenses.reduce((sum, e) => sum + e.money, 0).toLocaleString()} {tPage("currency")}
                    </span>
                </div>
            )}
        </div>
    </section>
));

ExpensesSection.displayName = 'ExpensesSection';

// 4. Statement Section (Shared for Accounts, Receipts, Payments)
interface StatementSectionProps {
    title: string;
    icon: string;
    colorClass: string;
    bgColorClass: string;
    groups: StatementSummary[];
    onSave: (statement: string, transfer: number, priceDiff: number, originalType?: string) => Promise<void>;
    tPage: any;
    tStatements: any;
    defaultType?: string;
}

export const StatementSection = React.memo(({ title, icon, colorClass, bgColorClass, groups, onSave, tPage, tStatements, defaultType }: StatementSectionProps) => (
    <section>
        <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl ${bgColorClass} ${colorClass} flex items-center justify-center`}>
                <i className={`bx ${icon} text-2xl`}></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {groups?.map((group, idx) => (
                <div key={idx} className="page-card shadow-glass border-none flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                        <h4 className="font-bold text-slate-800 text-lg">
                            {tStatements.has(group.statement) ? tStatements(group.statement as any) : group.statement}
                        </h4>
                        <Na2lFr2Editor
                            initialTransfer={group.transfer}
                            initialPriceDiff={group.priceDiff}
                            onSave={(transfer, priceDiff) => onSave(group.statement, transfer, priceDiff, group.originalType || defaultType)}
                        />
                    </div>
                    <div className="flex-grow space-y-2 mb-4">
                        {group.entries.map((entry, eIdx) => (
                            <div key={eIdx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                <span className="text-slate-600 text-sm">{entry.receiptName}</span>
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
                        <span className={`text-lg font-black ${colorClass}`}>{group.total.toLocaleString()} {tPage("currency")}</span>
                    </div>
                </div>
            ))}
        </div>
    </section>
));

StatementSection.displayName = 'StatementSection';
