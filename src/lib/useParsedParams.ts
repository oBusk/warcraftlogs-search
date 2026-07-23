"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useNavigationTransition } from "./NavigationTransition";
import { type ParsedParams, parseParams, toParams } from "./Params";
import { removeNonCanonicalParams } from "./seo-utils";
import { createUrl } from "./utils";

export function useParsedParams() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isPending, startTransition } = useNavigationTransition();

    const buildUrl = useCallback(
        (params: Partial<ParsedParams>, { canonical = false } = {}) => {
            const newParams = toParams(
                {
                    ...parseParams(searchParams),
                    ...params,
                },
                {
                    pruneDefaults: !canonical,
                },
            );

            if (canonical) {
                removeNonCanonicalParams(newParams);
            }

            return createUrl(".", newParams);
        },
        [searchParams],
    );

    const setParams = useCallback(
        (params: Partial<ParsedParams>) => {
            // Wrap the navigation in the shared transition so `isPending` stays
            // `true` until the new server components have streamed in and
            // committed. Consumers use it to indicate loading and to lock the
            // filters while data is fetched.
            startTransition(() => {
                router.replace(buildUrl(params));
            });
        },
        [buildUrl, router, startTransition],
    );

    return {
        ...parseParams(searchParams),
        buildUrl,
        setParams,
        isPending,
    };
}
