"use client";

import Link from "next/link";
import { useParsedParams } from "^/lib/useParsedParams";

export interface PageLinksProps {
    showNext: boolean;
}

export default function PageLinks({ showNext }: PageLinksProps) {
    const { pages, buildUrl } = useParsedParams();

    const previousPage = [pages[0] - 1];
    const nextPage = [pages[pages.length - 1] + 1];
    const morePage = [...pages, pages[pages.length - 1] + 1];

    const className =
        "text-blue-500 rounded-sm hover:bg-blue-500 hover:text-white";

    return (
        <>
            {pages[0] > 1 && (
                <>
                    <Link
                        href={buildUrl({ pages: previousPage })}
                        rel="noindex nofollow"
                        className={className}
                    >
                        Previous Page
                    </Link>
                    &nbsp;
                </>
            )}
            {showNext ? (
                <>
                    <Link
                        href={buildUrl({ pages: nextPage })}
                        rel="noindex nofollow"
                        className={className}
                    >
                        Next Page
                    </Link>
                    &nbsp;
                    <Link
                        href={buildUrl({ pages: morePage })}
                        rel="noindex nofollow"
                        className={className}
                    >
                        (Include Next Page)
                    </Link>
                </>
            ) : null}
        </>
    );
}
