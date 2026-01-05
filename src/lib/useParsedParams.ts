"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { type ParsedParams, parseParams, toParams } from "./Params";
import { removeNonCanonicalParams } from "./seo-utils";
import { createUrl } from "./utils";

export function useParsedParams() {
    const router = useRouter();
    const searchParams = useSearchParams();

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
            router.replace(buildUrl(params));
        },
        [buildUrl, router],
    );

    return {
        ...parseParams(searchParams),
        buildUrl,
        setParams,
    };
}
