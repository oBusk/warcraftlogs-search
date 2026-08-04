"use client";

import { useNavigationTransition } from "^/lib/NavigationTransition";

export default function NavigationProgress() {
    const { isPending } = useNavigationTransition();

    return (
        <div
            aria-hidden
            className={
                isPending
                    ? "nav-progress fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden"
                    : "hidden"
            }
        >
            <div className="nav-progress-bar h-full w-2/5 bg-blue-500" />
        </div>
    );
}
