"use client";

import React, { useState, Suspense } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [localError, setLocalError] = useState<string>("");

    const t = useTranslations("resetPassword");
    const router = useRouter();

    const { resetPassword, isResettingPassword } = useAuthActions();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setLocalError("Email is missing. Please go back to forgot password.");
            return;
        }

        if (password !== confirmPassword) {
            setLocalError("Passwords do not match");
            return;
        }

        setLocalError("");

        try {
            await resetPassword({ email, password });
            setIsSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err: any) {
            setLocalError(err.message || "Failed to reset password");
        }
    };

    return (
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

            <p className="text-white/40 text-center text-xs mb-8">
                Resetting password for: <span className="text-white/70">{email || "Unknown"}</span>
            </p>

            {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <input
                            type="password"
                            placeholder={t("password")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/15 transition-all"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder={t("confirmPassword")}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-5 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/15 transition-all"
                            required
                        />
                    </div>

                    {localError && (
                        <p className="text-red-300 text-sm text-center font-medium">{localError}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isResettingPassword || !email}
                        className="w-full py-3.5 bg-white text-primary font-semibold rounded-xl text-sm hover:bg-white/90 transition-all duration-200 hover:shadow-lg active:scale-[0.98] disabled:opacity-50"
                    >
                        {isResettingPassword ? "Updating..." : t("submit")}
                    </button>
                </form>
            ) : (
                <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                        <i className="bx bx-check text-3xl text-green-400"></i>
                    </div>
                    <p className="text-white text-lg font-medium mb-4">
                        {t("success")}
                    </p>
                    <p className="text-white/60 text-sm">
                        Redirecting to login...
                    </p>
                </div>
            )}

            <div className="mt-8 text-center pt-6 border-t border-white/10">
                <Link
                    href="/login"
                    className="text-white/60 hover:text-white text-sm transition-colors h-10 inline-flex items-center"
                >
                    Back to Login
                </Link>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
