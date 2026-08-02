"use client";

import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { type MouseEvent, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { useNavigationTransition } from "^/lib/NavigationTransition";
import { useParsedParams } from "^/lib/useParsedParams";

export interface PageLinksProps {
    showNext: boolean;
}

export default function PageLinks({ showNext }: PageLinksProps) {
    const { page, buildUrl } = useParsedParams();

    return (
        <>
            {page > 1 && (
                <>
                    <PageLink href={buildUrl({ page: page - 1 })}>
                        Previous Page
                    </PageLink>
                    &nbsp;
                </>
            )}
            {showNext ? (
                <PageLink href={buildUrl({ page: page + 1 })}>
                    Next Page
                </PageLink>
            ) : null}
        </>
    );
}

interface PageLinkProps {
    href: string;
    children: ReactNode;
}

function PageLink({ href, children }: PageLinkProps) {
    const router = useRouter();
    const { isPending, startTransition } = useNavigationTransition();

    const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
        if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
        ) {
            return;
        }

        event.preventDefault();

        if (isPending) {
            return;
        }

        startTransition(() => {
            router.push(href);
        });
    };

    return (
        <Link
            href={href}
            rel="nofollow"
            onClick={onClick}
            aria-disabled={isPending}
            aria-busy={isPending}
            className={twMerge(
                "rounded-sm text-blue-500 hover:bg-blue-500 hover:text-white",
                isPending && "pointer-events-none text-zinc-500",
            )}
        >
            {children}
        </Link>
    );
}
