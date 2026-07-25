"use client";

import {
    createContext,
    type ReactNode,
    type TransitionStartFunction,
    useContext,
    useTransition,
} from "react";

interface NavigationTransition {
    isPending: boolean;
    startTransition: TransitionStartFunction;
}

/**
 * Shares a single React transition across multiple components so that a
 * navigation started by one can be observed by all of them.
 *
 * `useTransition`'s `isPending` only reflects the transition started by that
 * specific hook instance — it is not global. This context holds one shared
 * instance so any consumer can start a navigation and every consumer can see
 * it is in flight.
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
    const [isPending, startTransition] = useTransition();

    return (
        <NavigationTransitionContext.Provider
            value={{ isPending, startTransition }}
        >
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
