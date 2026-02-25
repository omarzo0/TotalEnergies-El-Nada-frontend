"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import { TrendingUp, TrendingDown, Wallet, Users, Info } from "lucide-react";

interface DashboardCard {
    key: string;
    value: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
}

const salesData = [
    { name: "Sat", amount: 4000 },
    { name: "Sun", amount: 3000 },
    { name: "Mon", amount: 2000 },
    { name: "Tue", amount: 2780 },
    { name: "Wed", amount: 1890 },
    { name: "Thu", amount: 2390 },
    { name: "Fri", amount: 3490 },
];

const expenseData = [
    { name: "Fuel", value: 400 },
    { name: "Electricity", value: 300 },
    { name: "Salaries", value: 300 },
    { name: "Maintenance", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function OverviewPage() {
    const t = useTranslations("overview");

    const cards: DashboardCard[] = [
        {
            key: "totalSales",
            value: "145,230 EGP",
            icon: <TrendingUp className="w-6 h-6" />,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            key: "totalExpenses",
            value: "32,450 EGP",
            icon: <TrendingDown className="w-6 h-6" />,
            color: "text-rose-500",
            bg: "bg-rose-500/10"
        },
        {
            key: "netTreasury",
            value: "112,780 EGP",
            icon: <Wallet className="w-6 h-6" />,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            key: "employeeCount",
            value: "24",
            icon: <Users className="w-6 h-6" />,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        },
    ];

    return (
        <div className="pb-8">
            <Header titleKey="overview" />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cards.map((card, i) => (
                    <div key={i} className="page-card group hover:shadow-xl transition-all duration-300 border border-white/5 ring-1 ring-black/5">
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center transition-transform group-hover:scale-110 duration-300 shadow-sm`}>
                                {card.icon}
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                                    {t(card.key)}
                                </p>
                                <p className="text-xl font-bold text-slate-900 tracking-tight">
                                    {card.value}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Sales Trend */}
                <div className="page-card border border-white/5 shadow-sm overflow-hidden h-96">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800">{t("salesTrend")}</h3>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">+12.5%</span>
                    </div>
                    <div className="h-full pb-12">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0088FE" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0088FE" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        background: '#fff',
                                        padding: '12px'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#0088FE"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorAmount)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Expense Distribution */}
                <div className="page-card border border-white/5 shadow-sm overflow-hidden h-96">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">{t("expenseDistribution")}</h3>
                    <div className="h-full pb-12">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {expenseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Insights Section */}
            <div className="page-card border border-white/5 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <Info className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold text-slate-800">{t("insights")}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                            <i className="bx bx-bulb text-blue-500 text-xl"></i>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {t("insight1")}
                        </p>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                        <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                            <i className="bx bx-error-circle text-orange-500 text-xl"></i>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {t("insight2")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
