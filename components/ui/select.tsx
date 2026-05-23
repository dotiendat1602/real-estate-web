"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type NativeSelectProps = {
    value: string | number | undefined;
    onChange: (v: string) => void;
    children: React.ReactNode;
    className?: string;
    selectClassName?: string;
    disabled?: boolean;
    placeholder?: string;
} & Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "value" | "onChange" | "disabled" | "children" | "className"
>;

export function NativeSelect({
    value,
    onChange,
    children,
    className = "",
    selectClassName,
    disabled,
    placeholder,
    ...selectProps
}: NativeSelectProps) {
    return (
        <div className={cn("relative", className)}>
            <select
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={cn(
                    "flex h-10 w-full cursor-pointer appearance-none rounded-md border border-input bg-background px-3 py-2 pr-9 text-sm",
                    "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    selectClassName
                )}
                {...selectProps}
            >
                {placeholder !== undefined && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {children}
            </select>

            {/* caret icon */}
            <svg
                aria-hidden
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="m6 9 6 6 6-6" />
            </svg>
        </div>
    );
}
