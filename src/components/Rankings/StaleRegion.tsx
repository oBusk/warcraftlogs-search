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
            className={twMerge(
                "transition-opacity duration-150 motion-reduce:transition-none",
                busy && "pointer-events-none opacity-50",
                className,
            )}
            {...props}
        />
    );
}
