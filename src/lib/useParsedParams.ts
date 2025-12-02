"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { type ParsedParams, parseParams, toParams } from "./Params";
import { generateCanonicalUrl } from "./seo-utils";
import { createUrl } from "./utils";

export function useParsedParams() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const buildUrl = useCallback(
        (params: Partial<ParsedParams>) => {
            const newParams = toParams({
                ...parseParams(searchParams),
                ...params,
            });

            return createUrl(".", newParams);
        },
        [searchParams],
    );

    const buildCanonicalUrl = useCallback(
        (params: Partial<ParsedParams>) => {
            const newParams = {
                ...parseParams(searchParams),
                ...params,
            };

            return generateCanonicalUrl(newParams, ".");
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
        buildCanonicalUrl,
        setParams,
    };
}
