"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import Image from "next/image";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";

type Step = "request" | "verify" | "success";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState<string>("");
    const [otp, setOtp] = useState<string>("");
    const [step, setStep] = useState<Step>("request");
    const [localError, setLocalError] = useState<string>("");

    const t = useTranslations("forgotPassword");
    const router = useRouter();

    const {
        forgotPassword,
        isSendingOtp,
        verifyOtp,
        isVerifyingOtp
    } = useAuthActions();

    const isLoading = isSendingOtp || isVerifyingOtp;

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError("");
        try {
            await forgotPassword(email);
            setStep("verify");
        } catch (err: any) {
            setLocalError(t(err.message) || err.message || "Failed to send OTP");
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError("");
        try {
            await verifyOtp({ email, otp });
            setStep("success");
            // Automatically redirect to reset-password after a short delay
            setTimeout(() => {
                router.push(`/reset-password?email=${encodeURIComponent(email)}`);
            }, 1500);
        } catch (err: any) {
            setLocalError(t(err.message) || err.message || "Invalid OTP");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="relative w-full h-12 flex items-center justify-center p-2 group transition-all duration-300">
                            <span className="text-3xl font-black text-white tracking-tight">Petro<span className="text-secondary opacity-80">Desk</span></span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white text-center mb-4">
                        {t("title")}
                    </h2>

                    {step === "request" && (
                        <>
                            <p className="text-white/70 text-center mb-8 text-sm">
                                {t("description")}
                            </p>

                            <form onSubmit={handleRequestOtp} className="space-y-6">
                                <div>
                                    <input
                                        type="email"
                                        placeholder={t("email")}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-5 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/15 transition-all"
                                        required
                                    />
                                </div>

                                {localError && <p className="text-red-300 text-xs text-center">{localError}</p>}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3.5 bg-white text-primary font-semibold rounded-xl text-sm hover:bg-white/90 transition-all duration-200 hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? <span className="animate-pulse">Sending...</span> : t("submit")}
                                </button>
                            </form>
                        </>
                    )}

                    {step === "verify" && (
                        <>
                            <p className="text-white/70 text-center mb-8 text-sm">
                                {t("otpSent")}
                            </p>

                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <div>
                                    <input
                                        type="text"
                                        placeholder={t("otp")}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="w-full px-5 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 text-center text-2xl tracking-[0.5em] font-bold focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/15 transition-all"
                                        required
                                        autoFocus
                                        maxLength={6}
                                    />
                                </div>

                                {localError && <p className="text-red-300 text-xs text-center">{localError}</p>}

                                <button
                                    type="submit"
                                    disabled={isLoading || otp.length < 6}
                                    className="w-full py-3.5 bg-white text-primary font-semibold rounded-xl text-sm hover:bg-white/90 transition-all duration-200 hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? <span className="animate-pulse">Verifying...</span> : t("verify")}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep("request")}
                                    className="w-full text-white/60 text-xs hover:text-white transition-colors"
                                >
                                    Change Email
                                </button>
                            </form>
                        </>
                    )}

                    {step === "success" && (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                                <i className="bx bx-check text-3xl text-green-400"></i>
                            </div>
                            <p className="text-white text-lg font-medium mb-2">
                                {t("success")}
                            </p>
                            <p className="text-white/50 text-xs animate-pulse">
                                Redirecting to reset password...
                            </p>
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
