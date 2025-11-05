"use client";

import { Link } from "@remix-run/react";
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
        "text-blue-500 rounded-sm hover:bg-500 hover:text-white";

    return (
        <>
            {pages[0] > 1 && (
                <>
                    <Link
                        to={buildUrl({ pages: previousPage })}
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
                        to={buildUrl({ pages: nextPage })}
                        className={className}
                    >
                        Next Page
                    </Link>
                    &nbsp;
                    <Link
                        to={buildUrl({ pages: morePage })}
                        className={className}
                    >
                        (Include Next Page)
                    </Link>
                </>
            ) : null}
        </>
    );
}
