"use client";

import { type ReactNode, Suspense } from "react";
import { useNavigationTransition } from "^/lib/NavigationTransition";

export interface RankingsBoundaryProps {
    /** The (server-rendered) `<Rankings>` element. */
    children: ReactNode;
    /** The loading placeholder, e.g. `<RankingsFallback />`. */
    fallback: ReactNode;
}

/**
 * Wraps the rankings results so they show the same loading indicator on a
 * filter change as they do on the initial load.
 *
 * On the first render the `<Suspense>` boundary handles the streaming server
 * render. On a subsequent filter change the App Router keeps the previous
 * (stale) results on screen until the new server components commit, without
 * ever re-triggering the Suspense fallback. To bridge that gap we swap in the
 * fallback while the navigation transition is pending, so the results area
 * looks identical to the initial load until the fresh data arrives.
 */
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
