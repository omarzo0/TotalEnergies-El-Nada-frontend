"use client";

import React, { ReactNode } from "react";
import { useTranslations } from "next-intl";

interface ActionButtonsProps {
    onSave?: () => void;
    onAttach?: () => void;
    onPrint?: () => void;
    extra?: ReactNode;
}

export default function ActionButtons({ onSave, onAttach, onPrint, extra }: ActionButtonsProps) {
    const t = useTranslations("buttons");

    return (
        <div className="flex flex-wrap gap-3">
            {onSave && (
                <button onClick={onSave} className="btn-primary">
                    <i className="bx bx-save me-1"></i>
                    {t("save")}
                </button>
            )}
            {onAttach && (
                <button onClick={onAttach} className="btn-secondary">
                    <i className="bx bx-image-add me-1"></i>
                    {t("attachImage")}
                </button>
            )}
            {onPrint && (
                <button onClick={onPrint} className="btn-secondary">
                    <i className="bx bx-printer me-1"></i>
                    {t("printReport")}
                </button>
            )}
            {extra}
        </div>
    );
}
