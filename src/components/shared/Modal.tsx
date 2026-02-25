"use client";

import React, { ReactNode } from "react";
import { useTranslations } from "next-intl";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
    maxWidth?: string;
}

export default function Modal({ isOpen, onClose, title, children, footer, maxWidth = "max-w-lg" }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative bg-white dark:bg-slate-900 w-full ${maxWidth} rounded-2xl shadow-2xl border border-white/20 transform transition-all overflow-hidden flex flex-col`}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <i className="bx bx-x text-2xl"></i>
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 overflow-y-auto max-h-[70vh]">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
