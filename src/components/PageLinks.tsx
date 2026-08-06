"use client";

import Link from "next/link";
import { useState } from "react";

import { useParsedParams } from "^/lib/useParsedParams";

import NavigationPending from "./NavigationPending";

export interface PageLinksProps {
    showNext: boolean;
}

export default function PageLinks({ showNext }: PageLinksProps) {
    const { page, buildUrl } = useParsedParams();
    const [prevActive, setPrevActive] = useState(false);
    const [nextActive, setNextActive] = useState(false);

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
                        prefetch={prevActive ? true : false}
                        onMouseEnter={() => setPrevActive(true)}
                        onFocus={() => setPrevActive(true)}
                    >
                        Previous Page
                        <NavigationPending />
                    </Link>
                    &nbsp;
                </>
            )}
            {showNext ? (
                <Link
                    href={buildUrl({ page: page + 1 })}
                    rel="nofollow"
                    className={className}
                    prefetch={nextActive ? true : false}
                    onMouseEnter={() => setNextActive(true)}
                    onFocus={() => setNextActive(true)}
                >
                    Next Page
                    <NavigationPending />
                </Link>
            ) : null}
        </>
    );
}
