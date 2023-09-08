"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PARAM_NAMES } from "^/lib/PARAM_NAMES";
import { createUrl } from "^/lib/utils";

export interface PageLinksProps {
    showNext: boolean;
}

export default function PageLinks({ showNext }: PageLinksProps) {
    const searchParams = useSearchParams();

    const pages = searchParams
        .get(PARAM_NAMES.page)
        ?.split(",")
        .map(Number) ?? [1];

    const previousPage = [pages[0] - 1];
    const nextPage = [pages[pages.length - 1] + 1];
    const morePage = [...pages, pages[pages.length - 1] + 1];

    const previousPageParams = new URLSearchParams(searchParams);
    previousPageParams.set(PARAM_NAMES.page, previousPage.join(","));
    const nextPageParams = new URLSearchParams(searchParams);
    nextPageParams.set(PARAM_NAMES.page, nextPage.join(","));
    const morePageParams = new URLSearchParams(searchParams);
    morePageParams.set(PARAM_NAMES.page, morePage.join(","));

    const className =
        "text-blue-500 rounded-sm hover:bg-blue-500 hover:text-white";

    return (
        <>
            {pages[0] > 1 && (
                <>
                    <Link
                        href={createUrl(".", previousPageParams)}
                        className={className}
                    >
                        Previous Page
                    </Link>
                    &nbsp;
                </>
            )}
            {showNext && (
                <>
                    <Link
                        href={createUrl(".", nextPageParams)}
                        className={className}
                    >
                        Next Page
                    </Link>
                    &nbsp;
                    <Link
                        href={createUrl(".", morePageParams)}
                        className={className}
                    >
                        (Include Next Page)
                    </Link>
                </>
            )}
        </>
    );
}
