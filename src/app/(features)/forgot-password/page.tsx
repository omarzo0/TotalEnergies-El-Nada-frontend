"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export default function ForgotPasswordPage() {
    const [username, setUsername] = useState<string>("");
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const t = useTranslations("forgotPassword");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder: simulate sending reset link
        if (username) {
            setIsSubmitted(true);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="relative w-28 h-28 bg-white/10 rounded-2xl overflow-hidden flex items-center justify-center p-2 backdrop-blur-md border border-white/20 shadow-xl">
                            <Image
                                src="/images/logo.png"
                                alt="TotalEnergies Logo"
                                fill
                                className="object-contain p-3"
                                priority
                                unoptimized
                            />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white text-center mb-4">
                        {t("title")}
                    </h2>

                    {!isSubmitted ? (
                        <>
                            <p className="text-white/70 text-center mb-8 text-sm">
                                {t("description")}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <input
                                        type="text"
                                        placeholder={t("username")}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-5 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/15 transition-all"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3.5 bg-white text-primary font-semibold rounded-xl text-sm hover:bg-white/90 transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
                                >
                                    {t("submit")}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                                <i className="bx bx-check text-3xl text-green-400"></i>
                            </div>
                            <p className="text-white text-lg font-medium mb-8">
                                {t("success")}
                            </p>
                            <Link
                                href="/reset-password"
                                className="text-white/60 hover:text-white text-sm block mb-4 underline"
                            >
                                [Dev Mode] Go to Reset Page (Simulating link click)
                            </Link>
                        </div>
                    )}

                    <div className="mt-8 text-center pt-6 border-t border-white/10">
                        <Link
                            href="/login"
                            className="text-white/60 hover:text-white text-sm transition-colors inline-flex items-center gap-2"
                        >
                            <i className="bx bx-arrow-back rtl:rotate-180"></i>
                            {t("backToLogin")}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
