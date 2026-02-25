"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import { useFinancialSystem } from "../hooks/useFinancialSystem";

export default function IncomeStatementPage() {
    const t = useTranslations("pages");
    const { incomeStatement, isLoading } = useFinancialSystem();

    const tabs = [
        { labelKey: "trialBalance", href: "/financial-system/trial-balance", active: false },
        { labelKey: "incomeStatement", href: "/financial-system/income-statement", active: true },
    ];

    const netProfit = incomeStatement.reduce((acc, cat) => {
        if (cat.category === "Revenues") return acc + cat.total;
        if (cat.category === "Expenses") return acc - cat.total;
        return acc;
    }, 0);

    return (
        <div className="pb-10">
            <Header titleKey="financialSystem" tabs={tabs} />

            <div className="max-w-4xl mx-auto space-y-6">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        {incomeStatement.map((category) => (
                            <div key={category.category} className="page-card shadow-glass">
                                <h3 className="text-lg font-bold mb-4 text-primary border-b pb-2">
                                    {category.category}
                                </h3>
                                <div className="space-y-3">
                                    {category.items.map((item) => (
                                        <div key={item.name} className="flex justify-between text-sm">
                                            <span className="text-text-muted">{item.name}</span>
                                            <span className="font-semibold">{item.amount.toLocaleString()}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between pt-4 border-t font-bold text-base">
                                        <span>Total {category.category}</span>
                                        <span className={category.category === "Expenses" ? "text-danger" : "text-success"}>
                                            {category.total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="page-card bg-primary text-white shadow-card transform hover:scale-[1.02] transition-all duration-300">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold">Net Profit / Loss</h3>
                                    <p className="text-primary-foreground/80 text-sm">Total performance for the period</p>
                                </div>
                                <div className="text-3xl font-black">
                                    {netProfit.toLocaleString()} EGP
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
