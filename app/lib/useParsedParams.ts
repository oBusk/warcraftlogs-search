"use client";

import { useNavigate, useSearchParams } from "@remix-run/react";
import { useCallback } from "react";
import { type ParsedParams, parseParams, toParams } from "./Params";
import { createUrl } from "./utils";

export function useParsedParams() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

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

    const setParams = useCallback(
        (params: Partial<ParsedParams>) => {
            navigate(buildUrl(params), { replace: true });
        },
        [buildUrl, navigate],
    );

    return {
        ...parseParams(searchParams),
        buildUrl,
        setParams,
    };
}
