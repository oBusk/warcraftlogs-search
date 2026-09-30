"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wait this long before admitting to a navigation. Anything that settles
 * faster than this never renders an indicator at all.
 */
const APPEAR_DELAY = 200;
/**
 * Once shown, keep the indicator up for at least this long. Without it a
 * response arriving just after {@link APPEAR_DELAY} produces exactly the
 * flicker the delay exists to prevent.
 */
const MINIMUM_HOLD = 500;
const STILL_LOADING_AFTER = 10_000;

export interface DelayedBusy {
    busy: boolean;
    stillLoading: boolean;
}

export function useDelayedBusy(pending: boolean): DelayedBusy {
    const [busy, setBusy] = useState(false);
    const [stillLoading, setStillLoading] = useState(false);
    const shownAt = useRef(0);

    useEffect(() => {
        if (pending) {
            if (busy) {
                return;
            }

            const timeout = setTimeout(() => {
                shownAt.current = Date.now();
                setBusy(true);
            }, APPEAR_DELAY);

            return () => clearTimeout(timeout);
        }

        if (!busy) {
            return;
        }

        const remainingHold = MINIMUM_HOLD - (Date.now() - shownAt.current);

        const timeout = setTimeout(
            () => setBusy(false),
            Math.max(remainingHold, 0),
        );

        return () => clearTimeout(timeout);
    }, [pending, busy]);

    useEffect(() => {
        if (!busy) {
            return;
        }

        const timeout = setTimeout(
            () => setStillLoading(true),
            STILL_LOADING_AFTER,
        );

        return () => {
            clearTimeout(timeout);
            setStillLoading(false);
        };
    }, [busy]);

    return { busy, stillLoading };
}
