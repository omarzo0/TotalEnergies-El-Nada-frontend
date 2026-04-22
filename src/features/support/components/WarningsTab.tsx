"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useSupport } from "../hooks/useSupport";
import { SupportWarning } from "../api/support.api";
import Button from "@/ui/Button";
import { Input } from "@/ui/Input";

export default function WarningsTab() {
    const t = useTranslations("support.warnings");
    const tButtons = useTranslations("buttons");
    const { warnings, isLoadingWarnings, addWarningResponse } = useSupport();
    const [selectedWarning, setSelectedWarning] = useState<SupportWarning | null>(null);
    const [responseMessage, setResponseMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRespond = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedWarning || !responseMessage.trim()) return;

        setIsSubmitting(true);
        try {
            await addWarningResponse({ id: selectedWarning._id, message: responseMessage });
            setResponseMessage("");
            // Refresh local selected warning
            const updated = warnings.find(w => w._id === selectedWarning._id);
            if (updated) setSelectedWarning(updated);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingWarnings) {
        return (
            <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-slate-100 rounded-xl"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="lg:col-span-1 space-y-4">
                <h3 className="text-lg font-bold text-slate-800 mb-4">{t("listTitle")}</h3>
                {warnings.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <i className="bx bx-check-shield text-4xl mb-2"></i>
                        <p>{t("noWarnings")}</p>
                    </div>
                ) : (
                    warnings.map((warning) => (
                        <div
                            key={warning._id}
                            onClick={() => setSelectedWarning(warning)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm
                                ${selectedWarning?._id === warning._id
                                    ? "bg-slate-900 text-white border-slate-950 scale-[1.02]"
                                    : "bg-white text-slate-600 border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full
                                    ${warning.severity === 'critical' ? 'bg-red-500 text-white' :
                                        warning.severity === 'high' ? 'bg-orange-500 text-white' :
                                            'bg-blue-500 text-white'}`}>
                                    {t(`severity.${warning.severity}`)}
                                </span>
                                <span className={`text-[10px] ${selectedWarning?._id === warning._id ? 'text-slate-400' : 'text-slate-400'}`}>
                                    {new Date(warning.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <h4 className="font-bold truncate">{warning.title}</h4>
                        </div>
                    ))
                )}
            </div>

            {/* Detail/Respond */}
            <div className="lg:col-span-2">
                {selectedWarning ? (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{selectedWarning.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{selectedWarning.message}</p>
                        </div>

                        {/* Responses */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                            {selectedWarning.responses.map((resp, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${resp.userType === 'station' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm
                                        ${resp.userType === 'station'
                                            ? 'bg-primary text-white rounded-tr-none'
                                            : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}`}>
                                        <p className="text-sm">{resp.message}</p>
                                        <span className={`text-[10px] block mt-1 opacity-60 text-right`}>
                                            {new Date(resp.createdAt).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {selectedWarning.responses.length === 0 && (
                                <p className="text-center text-slate-400 py-10 italic">{t("noResponses")}</p>
                            )}
                        </div>

                        {/* Respond Form */}
                        <form onSubmit={handleRespond} className="p-6 border-t border-slate-100 bg-white">
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <Input
                                        placeholder={t("responsePlaceholder")}
                                        value={responseMessage}
                                        onChange={(e) => setResponseMessage(e.target.value)}
                                        className="!mb-0"
                                    />
                                </div>
                                <Button disabled={isSubmitting || !responseMessage.trim()}>
                                    {isSubmitting ? <span className="animate-spin text-lg">bx-loader-alt</span> : tButtons("send")}
                                </Button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 p-10 bg-white rounded-2xl border border-dashed border-slate-100">
                        <i className="bx bx-info-circle text-5xl mb-4"></i>
                        <p>{t("selectPrompt")}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
