// src/lib/seo-utils.ts
// Utility functions for SEO-related URL handling

import { parseParams, type RawParams, toParams } from "./Params";

type SearchParams = Record<string, string | string[] | undefined>;

/**
 * Checks if the given search parameters contain a 'pages' parameter.
 * Used only for the main search page to determine if results should be indexed.
 *
 * @param {SearchParams} searchParams - The search parameters to check
 * @returns {boolean} True if pagination is present and page should not be indexed
 */
export function shouldNoIndex(searchParams: SearchParams): boolean {
    return Object.prototype.hasOwnProperty.call(searchParams, "pages");
}

/**
 * Generates a canonical URL by normalizing parameters and removing defaults and pagination.
 * This ensures consistent URLs regardless of parameter order or default values.
 *
 * @param {SearchParams} searchParams - The search parameters to use
 * @param {string} baseUrl - The base URL (defaults to "https://wcl.nulldozzer.io")
 * @returns {string} The canonical URL with normalized query parameters
 */
export function generateCanonicalUrl(
    searchParams: SearchParams,
    baseUrl = "https://wcl.nulldozzer.io",
): string {
    // Convert SearchParams to RawParams format expected by parseParams
    const rawParams: Partial<RawParams> = {};
    Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined) {
            if (Array.isArray(value)) {
                // For arrays, join with comma (this matches how pagination works)
                rawParams[key as keyof RawParams] = value.join(",");
            } else {
                rawParams[key as keyof RawParams] = value;
            }
        }
    });

    // Parse parameters using existing logic, then convert back to URLSearchParams
    // This normalizes parameter types and applies defaults
    const parsedParams = parseParams(rawParams);

    // Convert back to URLSearchParams, which automatically:
    // - Removes parameters that match defaults
    // - Ensures consistent parameter ordering
    // - Handles all parameter types properly
    const normalizedParams = toParams(parsedParams);

    // Remove pagination parameter from canonical URL
    normalizedParams.delete("page");

    const url = new URL(baseUrl);
    url.search = normalizedParams.toString();
    return url.toString();
}
