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

const NavigationTransitionContext = createContext<NavigationTransition | null>(
    null,
);

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
