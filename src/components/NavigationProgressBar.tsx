"use client";

import { useNavigationPending } from "^/lib/NavigationPending";

export default function NavigationProgressBar() {
    const { busy } = useNavigationPending();

    if (!busy) {
        return null;
    }

    return (
        <div
            aria-hidden
            className="fixed inset-x-0 top-0 z-50 h-[3px] overflow-hidden bg-blue-500/20"
        >
            <div className="h-full w-2/5 animate-indeterminate rounded-full bg-blue-500" />
        </div>
    );
}
