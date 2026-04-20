"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import Image from "next/image";

import { useAuthActions } from "@/features/auth/hooks/useAuthActions";

export default function LoginPage() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [localError, setLocalError] = useState<string>("");
    const t = useTranslations("login");
    const router = useRouter();

    const { login, isLoggingIn } = useAuthActions();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError("");

        try {
            await login({ email: username, password });
        } catch (err: any) {
            setLocalError(t(err.message) || err.message || "Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Glass card */}
                <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="relative w-28 h-28 bg-white/10 rounded-2xl overflow-hidden flex items-center justify-center p-2 backdrop-blur-md border border-white/20 shadow-xl group hover:bg-white/20 transition-all duration-300">
                            <Image
                                src="/images/logo.png"
                                alt="TotalEnergies Logo"
                                fill
                                className="object-contain p-3 transition-transform duration-500 group-hover:scale-110"
                                priority
                                unoptimized
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-white text-center mb-8">
                        {t("title")}
                    </h2>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <input
                                type="text"
                                placeholder={t("username")}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-5 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/15 transition-all"
                                required
                                disabled={isLoggingIn}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder={t("password")}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/15 transition-all"
                                required
                                disabled={isLoggingIn}
                            />
                            <div className="flex justify-end mt-2">
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-white/60 hover:text-white transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        {localError && (
                            <p className="text-red-300 text-sm text-center">{localError}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full py-3.5 bg-white text-primary font-semibold rounded-xl text-sm hover:bg-white/90 transition-all duration-200 hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoggingIn ? (
                                <div className="flex items-center justify-center gap-2">
                                    <i className="bx bx-loader-alt animate-spin text-lg"></i>
                                    {t("submit")}...
                                </div>
                            ) : (
                                t("submit")
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
