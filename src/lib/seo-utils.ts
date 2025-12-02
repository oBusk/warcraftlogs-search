import {
    type ParsedParams,
    parseParams,
    type RawParams,
    toParams,
} from "./Params";

/**
 * Builds a canonical URL from parsed parameters by removing the 'pages' parameter
 * while preserving other parameters.
 *
 * @param {ParsedParams | Partial<ParsedParams>} parsed - The parsed parameters
 * @param {string} baseUrl - The base URL (defaults to "https://wcl.nulldozzer.io")
 * @returns {string} The canonical URL with query parameters
 */
export function buildCanonicalUrl(
    parsed: ParsedParams | Partial<ParsedParams>,
    baseUrl = "https://wcl.nulldozzer.io",
): string {
    // Create a copy without the 'pages' parameter
    const { pages, ...paramsWithoutPages } = parsed as ParsedParams;

    // Use toParams to serialize, which handles defaults and proper formatting
    const params = toParams(paramsWithoutPages as ParsedParams);

    const url = new URL(baseUrl);
    url.search = params.toString();
    return url.toString();
}

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
    // Use `parseParams` to get the parsed parameters
    const parsed = parseParams(raw);
    return buildCanonicalUrl(parsed, baseUrl);
}
