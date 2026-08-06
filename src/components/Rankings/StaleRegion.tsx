"use client";

import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

import { useNavigationPending } from "^/lib/NavigationPending";

export default function StaleRegion({
    className,
    ...props
}: ComponentProps<"div">) {
    const { busy } = useNavigationPending();

    return (
        <div
            aria-busy={busy}
            className={twMerge(busy && "pointer-events-none", className)}
            {...props}
        />
    );
}
