"use client";

import React from "react";

interface SkeletonProps {
    className?: string;
    variant?: "text" | "circular" | "rectangular";
    width?: string | number;
    height?: string | number;
}

export default function Skeleton({
    className = "",
    variant = "rectangular",
    width,
    height
}: SkeletonProps) {
    const baseStyles = "animate-pulse bg-slate-200/60";

    const variantStyles = {
        text: "rounded h-3 w-full mb-2",
        circular: "rounded-full",
        rectangular: "rounded-2xl"
    };

    const style: React.CSSProperties = {
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
    };

    return (
        <div
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            style={style}
        />
    );
}
