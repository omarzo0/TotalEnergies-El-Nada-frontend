"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/ui/Input";
import Button from "@/ui/Button";
import Modal from "@/components/shared/Modal";
import { useBenzenePrices } from "../hooks/useBenzenePrices";

interface BenzenePricesTabProps {
    date: string;
}

export default function BenzenePricesTab({ date }: BenzenePricesTabProps) {
    const t = useTranslations("benzene.pricesTab");
    const tButtons = useTranslations("buttons");
    const tModals = useTranslations("modals");

    const { prices, isLoading, isSaving, error, savePrices, deletePrices } = useBenzenePrices(date);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editData, setEditData] = useState({
        solarPrice: 0,
        ben80Price: 0,
        ben92Price: 0,
        ben95Price: 0
    });

    const startEditing = () => {
        if (prices) {
            setEditData({ ...prices });
        }
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
    };

    const handleSave = async () => {
        const success = await savePrices(editData);
        if (success) {
            setIsEditing(false);
        }
    };

    const handleDeleteConfirm = async () => {
        const success = await deletePrices();
        if (success) {
            setIsDeleteModalOpen(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: Number(value) }));
    };

    const priceCards = [
        { key: "solarPrice", label: t("solar"), icon: "bx-sun", color: "from-amber-500 to-orange-500" },
        { key: "ben80Price", label: t("ben80"), icon: "bx-gas-pump", color: "from-emerald-500 to-teal-500" },
        { key: "ben92Price", label: t("ben92"), icon: "bx-gas-pump", color: "from-blue-500 to-indigo-500" },
        { key: "ben95Price", label: t("ben95"), icon: "bx-gas-pump", color: "from-violet-500 to-purple-500" }
    ];

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex justify-end gap-3">
                {!isEditing ? (
                    <>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-2.5 rounded-xl transition-all duration-200 border border-red-100 flex items-center justify-center"
                            title="Reset Prices"
                            disabled={isLoading || !prices}
                        >
                            <i className="bx bx-trash text-xl"></i>
                        </button>
                        <button
                            onClick={startEditing}
                            className="btn-primary flex items-center gap-2"
                            disabled={isLoading}
                        >
                            <i className="bx bx-edit text-lg"></i>
                            {tButtons("edit")}
                        </button>
                    </>
                ) : (
                    <>
                        <Button variant="secondary" onClick={cancelEditing}>
                            {tButtons("cancel")}
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                    {t("saving")}
                                </span>
                            ) : (
                                tButtons("save")
                            )}
                        </Button>
                    </>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-medium flex items-center gap-2">
                    <i className="bx bx-error-circle text-lg"></i>
                    {error}
                </div>
            )}

            {/* Loading */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {priceCards.map((card) => {
                        const value = prices ? prices[card.key as keyof typeof prices] : 0;
                        return (
                            <div
                                key={card.key}
                                className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 group"
                            >
                                <div className={`h-1.5 bg-gradient-to-r ${card.color}`}></div>

                                <div className="p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-sm`}>
                                            <i className={`bx ${card.icon} text-xl`}></i>
                                        </div>
                                        <span className="text-sm font-semibold text-slate-600">{card.label}</span>
                                    </div>

                                    {isEditing ? (
                                        <Input
                                            name={card.key}
                                            type="number"
                                            step="0.01"
                                            value={editData[card.key as keyof typeof editData]}
                                            onChange={handleChange}
                                            label=""
                                        />
                                    ) : (
                                        <div className="text-2xl font-bold text-slate-800 tracking-tight">
                                            {value?.toFixed(2) ?? "—"}
                                            <span className="text-sm font-normal text-slate-400 ms-1">{t("currency")}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* No data state */}
            {!isLoading && (!prices || (prices.solarPrice === 0 && prices.ben80Price === 0)) && !error && (
                <div className="text-center py-16 text-slate-400">
                    <i className="bx bx-data text-5xl mb-3 block"></i>
                    <p className="font-medium">{t("noData")} ({date})</p>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title={tModals("confirmDeleteTitle")}
                footer={
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
                            {tButtons("cancel")}
                        </Button>
                        <Button
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={handleDeleteConfirm}
                            disabled={isSaving}
                        >
                            {isSaving ? "Deleting..." : tButtons("delete")}
                        </Button>
                    </div>
                }
            >
                <div className="flex flex-col items-center text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4 scale-110 shadow-sm border border-red-100">
                        <i className="bx bx-trash text-3xl"></i>
                    </div>
                    <p className="text-slate-600 font-medium leading-relaxed">
                        Are you sure you want to delete all price records for <br />
                        <span className="text-slate-900 font-bold">{new Date(date).toLocaleDateString()}</span>?
                    </p>
                    <p className="text-xs text-slate-400 mt-3 font-normal">
                        This action cannot be undone and will reset prices to zero.
                    </p>
                </div>
            </Modal>
        </div>
    );
}
