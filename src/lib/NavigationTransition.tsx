"use client";

import {
    createContext,
    type ReactNode,
    type TransitionStartFunction,
    useContext,
    useTransition,
} from "react";

interface NavigationTransition {
    /**
     * Whether a navigation started via {@link startTransition} is currently
     * in flight (the new server components have not committed yet).
     */
    isPending: boolean;
    /**
     * Wraps the navigation so that {@link isPending} stays `true` for the whole
     * round-trip, from the moment the user acts until the new page commits.
     */
    startTransition: TransitionStartFunction;
}

const NavigationTransitionContext = createContext<NavigationTransition | null>(
    null,
);

/**
 * Shares a single {@link useTransition} across every filter, so that a
 * navigation started by one control (e.g. a dropdown) exposes its pending
 * state to all of them. This lets us disable every filter while data loads and
 * lets the results area show a loading indicator, instead of leaving the page
 * looking frozen while the new server components stream in.
 */
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

export function useNavigationTransition() {
    const context = useContext(NavigationTransitionContext);

    if (context == null) {
        throw new Error(
            "useNavigationTransition must be used within a NavigationTransitionProvider",
        );
    }

    return context;
}
