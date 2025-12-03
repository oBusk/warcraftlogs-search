import { parseParams, type RawParams, toParams } from "./Params";

/**
 * Generates a canonical URL by removing the 'pages' parameter while preserving other parameters.
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
    urlSearchParams.delete("pages");
}
