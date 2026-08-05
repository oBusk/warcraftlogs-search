"use client";

import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { useNavigationPending } from "^/lib/NavigationPending";

import { RESULTS_ID } from "./layout";

export interface RankingsShellProps {
    className?: string;
    children: ReactNode;
}

export default function RankingsShell({
    className,
    children,
}: RankingsShellProps) {
    const { busy, stillLoading } = useNavigationPending();

    return (
        <div
            id={RESULTS_ID}
            className={twMerge("relative scroll-mt-4", className)}
        >
            {busy ? (
                <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[3px] overflow-hidden rounded-full bg-blue-500/20"
                >
                    <div className="h-full w-2/5 animate-indeterminate rounded-full bg-blue-500" />
                </div>
            ) : null}
            <p aria-live="polite" className="sr-only">
                {busy ? "Loading results" : ""}
            </p>
            {stillLoading ? (
                <p className="mb-2 text-center text-sm text-gray-500">
                    Still loading…
                </p>
            ) : null}
            {children}
        </div>
    );
}
