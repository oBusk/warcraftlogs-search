"use client";

import {
    createContext,
    type ReactNode,
    type TransitionStartFunction,
    useCallback,
    useContext,
    useMemo,
    useState,
    useTransition,
} from "react";

interface NavigationTransition {
    isPending: boolean;
    startTransition: TransitionStartFunction;
    setLinkPending: (pending: boolean) => void;
}

/**
 * Shares a single React transition across multiple components so that a
 * navigation started by one can be observed by all of them.
 *
 * `useTransition`'s `isPending` only reflects the transition started by that
 * specific hook instance — it is not global. This context holds one shared
 * instance so any consumer can start a navigation and every consumer can see
 * it is in flight.
 *
 * `setLinkPending` folds in `<Link>` navigations (tracked separately via
 * `useLinkStatus`, see `NavigationPending`) so `isPending` reflects both
 * `router.replace` transitions and plain link clicks.
 */
const NavigationTransitionContext = createContext<NavigationTransition | null>(
    null,
);

/** Provides {@link NavigationTransitionContext}. Wrap once, above every consumer. */
export function NavigationTransitionProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [isTransitionPending, startTransition] = useTransition();
    const [pendingLinkCount, setPendingLinkCount] = useState(0);

    const setLinkPending = useCallback((pending: boolean) => {
        setPendingLinkCount((count) => count + (pending ? 1 : -1));
    }, []);

    const value = useMemo(
        (): NavigationTransition => ({
            isPending: isTransitionPending || pendingLinkCount > 0,
            startTransition,
            setLinkPending,
        }),
        [
            isTransitionPending,
            pendingLinkCount,
            startTransition,
            setLinkPending,
        ],
    );

    return (
        <NavigationTransitionContext.Provider value={value}>
            {children}
        </NavigationTransitionContext.Provider>
    );
}

/**
 * Reads the shared transition.
 *
 * @see {@link NavigationTransitionContext}
 */
export function useNavigationTransition() {
    const context = useContext(NavigationTransitionContext);

    if (context == null) {
        throw new Error(
            "useNavigationTransition must be used within a NavigationTransitionProvider",
        );
    }

    return context;
}
