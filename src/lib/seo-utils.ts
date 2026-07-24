import {
    type ParamKey,
    paramTypes,
    type ParsedParams,
    parseParams,
    type RawParams,
    toParams,
} from "./Params";

/**
 * Generates a canonical URL by removing the non-canonical parameters while
 * preserving other parameters.
 *
 * @param {RawParams} raw - The raw search parameters to use
 * @param {string} baseUrl - The base URL (defaults to "https://wcl.nulldozzer.io")
 * @returns {string} The canonical URL with query parameters
 */
export function generateCanonicalUrl(
    raw: RawParams,
    baseUrl = "https://wcl.nulldozzer.io",
): string {
    const parsedParams = parseParams(raw);
    const canonicalParams = toParams(parsedParams, {
        pruneDefaults: false,
    });

    removeNonCanonicalParams(canonicalParams);

    const url = new URL(baseUrl);
    url.search = canonicalParams.toString();
    return url.toString();
}

export function removeNonCanonicalParams(
    urlSearchParams: URLSearchParams,
): void {
    for (const [key, { canonical }] of Object.entries(paramTypes)) {
        if (!canonical) {
            urlSearchParams.delete(key);
        }
    }
}

/**
 * Whether a page should be offered to search engines for indexing.
 *
 * Pages that narrow the results beyond the encounter being searched (by class,
 * spec, talents, items, partition or page number) are still canonical and
 * shareable, but there are combinatorially many of them and no value in having
 * them indexed individually.
 */
export function isIndexable(parsedParams: ParsedParams): boolean {
    return [...toParams(parsedParams).keys()].every(
        (key) => paramTypes[key as ParamKey].indexable,
    );
}
