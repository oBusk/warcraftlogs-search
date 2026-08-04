"use client";

import { type ReactNode, Suspense } from "react";
import { twMerge } from "tailwind-merge";

import { useNavigationTransition } from "^/lib/NavigationTransition";

export interface RankingsBoundaryProps {
    children: ReactNode;
    fallback: ReactNode;
}

export default function RankingsBoundary({
    children,
    fallback,
}: RankingsBoundaryProps) {
    const { isPending } = useNavigationTransition();

    return (
        <Suspense fallback={fallback}>
            <div
                aria-busy={isPending}
                className={twMerge(isPending && "stale-dim")}
            >
                {children}
            </div>
        </Suspense>
    );
}
