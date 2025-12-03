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

            console.log("buildUrl", {
                params,
                newParams: newParams.toString(),
            });
            if (canonical) {
                removeNonCanonicalParams(newParams);
            }
            console.log("buildUrl after canonical", {
                params,
                newParams: newParams.toString(),
            });

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
