"use client";

import { useLinkStatus } from "next/link";
import { useEffect } from "react";

import { useNavigationTransition } from "^/lib/NavigationTransition";

/**
 * Reports a `<Link>`'s pending state into {@link useNavigationTransition},
 * so link clicks show the same loading feedback as `setParams` navigations.
 *
 * Must be rendered as a descendant of the `<Link>` it tracks.
 */
export default function NavigationPending() {
    const { pending } = useLinkStatus();
    const { setLinkPending } = useNavigationTransition();

    useEffect(() => {
        if (!pending) {
            return;
        }

        setLinkPending(true);
        return () => setLinkPending(false);
    }, [pending, setLinkPending]);

    return null;
}
