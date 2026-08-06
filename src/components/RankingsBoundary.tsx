"use client";

import { type ReactNode, Suspense } from "react";
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
            {isPending ? fallback : children}
        </Suspense>
    );
}
