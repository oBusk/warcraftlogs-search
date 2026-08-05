"use client";

import { useEffect } from "react";

import { useNavigationPending } from "^/lib/NavigationPending";

import { RESULTS_ID } from "./layout";

export interface ScrollOnPageChangeProps {
    page: number;
}

/**
 * Renders nothing. Scrolls the results into view once a new page has rendered,
 * but only when the navigation came from a pagination control — after a filter
 * change the user is already at the top and an animated scroll is noise.
 */
export default function ScrollOnPageChange({ page }: ScrollOnPageChangeProps) {
    const { scrollOnSettleRef } = useNavigationPending();

    useEffect(() => {
        if (!scrollOnSettleRef.current) {
            return;
        }

        scrollOnSettleRef.current = false;

        document.getElementById(RESULTS_ID)?.scrollIntoView({
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth",
            block: "start",
        });
    }, [page, scrollOnSettleRef]);

    return null;
}
