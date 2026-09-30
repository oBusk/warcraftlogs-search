"use client";

import {
    createContext,
    type ReactNode,
    type RefObject,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useTransition,
} from "react";
import { type DelayedBusy, useDelayedBusy } from "./useDelayedBusy";

interface NavigationPending extends DelayedBusy {
    startNavigation: (navigate: () => void) => void;
    scrollOnSettleRef: RefObject<boolean>;
}

const NavigationPendingContext = createContext<NavigationPending | null>(null);

export function useNavigationPending(): NavigationPending {
    const navigationPending = useContext(NavigationPendingContext);

    if (navigationPending == null) {
        throw new Error(
            "useNavigationPending must be used inside a NavigationPendingProvider",
        );
    }

    return navigationPending;
}

export interface NavigationPendingProviderProps {
    children: ReactNode;
}

/**
 * Holds the pending state for every navigation the page can start, so one
 * indicator covers all of them and stays continuous across rapid changes.
 *
 * `useLinkStatus` is deliberately not used: under Partial Prefetching every
 * `<Link>` to a route whose App Shell is prefetched reports `pending: false`,
 * which is every link here. Navigation therefore goes through `router.push`
 * inside this transition, which stays pending until the streamed data commits.
 */
export function NavigationPendingProvider({
    children,
}: NavigationPendingProviderProps) {
    const [isPending, startTransition] = useTransition();
    const scrollOnSettleRef = useRef(false);

    const { busy, stillLoading } = useDelayedBusy(isPending);

    const startNavigation = useCallback(
        (navigate: () => void) => startTransition(navigate),
        [],
    );

    const value = useMemo(
        () => ({ busy, stillLoading, startNavigation, scrollOnSettleRef }),
        [busy, stillLoading, startNavigation],
    );

    return (
        <NavigationPendingContext value={value}>
            {children}
        </NavigationPendingContext>
    );
}
