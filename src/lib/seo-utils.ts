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

    // Remove 'pages' parameter
    canonicalParams.delete("pages");

    const entries = Array.from(canonicalParams.entries());
    // Remove parameters that are null, undefined, or empty arrays
    for (const [key, value] of entries) {
        if (value === "" || value === "[]") {
            canonicalParams.delete(key);
        }
    }

    const url = new URL(baseUrl);
    url.search = canonicalParams.toString();
    return url.toString();
}
