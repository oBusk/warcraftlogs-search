"use client";

import Link from "next/link";
import { type MouseEvent } from "react";

import { useNavigationPending } from "^/lib/NavigationPending";
import { useParsedParams } from "^/lib/useParsedParams";

export interface PageLinksProps {
    label: string;
    hasNextPage: boolean;
}

const enabled =
    "rounded-xs px-1 text-blue-500 hover:bg-blue-500 hover:text-white";
const disabled = "rounded-xs px-1 text-gray-600";

function isPlainClick(event: MouseEvent) {
    return (
        event.button === 0 &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.altKey
    );
}

export default function PageLinks({ label, hasNextPage }: PageLinksProps) {
    const { page, buildUrl, setParams } = useParsedParams();
    const { scrollOnSettleRef } = useNavigationPending();

    const goToPage =
        (target: number) => (event: MouseEvent<HTMLAnchorElement>) => {
            if (!isPlainClick(event)) {
                return;
            }

            event.preventDefault();
            scrollOnSettleRef.current = true;
            setParams({ page: target });
        };

    return (
        <nav aria-label={label} className="flex justify-center gap-4">
            {page > 1 ? (
                <Link
                    href={buildUrl({ page: page - 1 })}
                    rel="nofollow"
                    className={enabled}
                    onClick={goToPage(page - 1)}
                >
                    Previous Page
                </Link>
            ) : (
                <button type="button" disabled className={disabled}>
                    Previous Page
                </button>
            )}
            {hasNextPage ? (
                <Link
                    href={buildUrl({ page: page + 1 })}
                    rel="nofollow"
                    className={enabled}
                    onClick={goToPage(page + 1)}
                >
                    Next Page
                </Link>
            ) : (
                <button type="button" disabled className={disabled}>
                    Next Page
                </button>
            )}
        </nav>
    );
}
