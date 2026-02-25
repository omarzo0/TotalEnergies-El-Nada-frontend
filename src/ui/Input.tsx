import React, { InputHTMLAttributes, SelectHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
    return (
        <div className={className}>
            {label && <label className="form-label">{label}</label>}
            <input
                className={`form-input ${error ? "border-danger ring-danger/20" : ""}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-xs text-danger animate-in fade-in slide-in-from-top-1 duration-200">
                    {error}
                </p>
            )}
        </div>
    );
}

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options?: SelectOption[];
}

export function Select({
    label,
    options = [],
    className = "",
    ...props
}: SelectProps) {
    return (
        <div className={className}>
            {label && <label className="form-label">{label}</label>}
            <select className="form-input" {...props}>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export function TextArea({ label, error, className = "", ...props }: TextAreaProps) {
    return (
        <div className={className}>
            {label && <label className="form-label">{label}</label>}
            <textarea
                className={`form-input min-h-[100px] py-3 ${error ? "border-danger ring-danger/20" : ""}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-xs text-danger">
                    {error}
                </p>
            )}
        </div>
    );
}
