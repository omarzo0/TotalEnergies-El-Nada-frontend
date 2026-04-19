"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { User, AuthContextType } from "@/types";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const stored = localStorage.getItem("auth_user");
        let userData: User | null = null;
        if (stored) {
            try {
                userData = JSON.parse(stored);
            } catch {
                localStorage.removeItem("auth_user");
                localStorage.removeItem("token");
            }
        }
        setUser(userData);
        setLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        // This is a placeholder that matches the LoginPage logic
        // In a real app, this would call the API
        if (username && password) {
            // Note: The actual login is handled in LoginPage.tsx
            // This hook exists as a global state manager
            return { success: false, error: "Use LoginPage to sign in" };
        }
        return { success: false, error: "Invalid credentials" };
    };

    const logout = () => {
        localStorage.removeItem("auth_user");
        localStorage.removeItem("token");
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, login, logout, isAuthenticated: !!user }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
