"use client";

import Link from "next/link";
import { useParsedParams } from "^/lib/useParsedParams";

export interface PageLinksProps {
    showNext: boolean;
}

export default function PageLinks({ showNext }: PageLinksProps) {
    const { page, buildUrl } = useParsedParams();

    const className =
        "text-blue-500 rounded-xs hover:bg-blue-500 hover:text-white";

    return (
        <>
            {page > 1 && (
                <>
                    <Link
                        href={buildUrl({ page: page - 1 })}
                        rel="nofollow"
                        className={className}
                    >
                        Previous Page
                    </Link>
                    &nbsp;
                </>
            )}
            {showNext ? (
                <Link
                    href={buildUrl({ page: page + 1 })}
                    rel="nofollow"
                    className={className}
                >
                    Next Page
                </Link>
            ) : null}
        </>
    );
}
