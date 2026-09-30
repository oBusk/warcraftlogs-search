"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
    buildUrl as buildUrlFor,
    resolveFilterNavigation,
} from "./filterNavigation";
import { useNavigationPending } from "./NavigationPending";
import { type ParsedParams, parseParams } from "./Params";

export function useParsedParams() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { startNavigation } = useNavigationPending();

    const buildUrl = useCallback(
        (params: Partial<ParsedParams>, options?: { canonical?: boolean }) =>
            buildUrlFor(searchParams, params, options),
        [searchParams],
    );

    const setParams = useCallback(
        (params: Partial<ParsedParams>) => {
            const url = resolveFilterNavigation(searchParams, params);

            if (url == null) {
                return;
            }

            startNavigation(() => router.push(url, { scroll: false }));
        },
        [router, searchParams, startNavigation],
    );

    return {
        ...parseParams(searchParams),
        buildUrl,
        setParams,
    };
}
