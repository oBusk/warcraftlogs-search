"use client";

import { useEffect } from "react";

import { useNavigationPending } from "^/lib/NavigationPending";

import { RESULTS_ID } from "./layout";

export interface ScrollOnPageChangeProps {
    page: number;
}

/**
 * Renders nothing. Brings the results back into view once a new page has
 * rendered, but only when paging from the lower controls has left them above
 * the viewport. A filter change never scrolls, and neither does paging from
 * the upper controls, where the results are already on screen.
 */
export default function ScrollOnPageChange({ page }: ScrollOnPageChangeProps) {
    const { scrollOnSettleRef } = useNavigationPending();

    useEffect(() => {
        if (!scrollOnSettleRef.current) {
            return;
        }

        scrollOnSettleRef.current = false;

        const results = document.getElementById(RESULTS_ID);

        if (results == null || results.getBoundingClientRect().top >= 0) {
            return;
        }

        results.scrollIntoView({
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth",
            block: "start",
        });
    }, [page, scrollOnSettleRef]);

    return null;
}
