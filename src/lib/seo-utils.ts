import { parseParams, type RawParams } from "./Params";

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
    // Use `parseParams` to get the parsed parameters (including default values)
    const parsed = parseParams(raw);

    const params = new URLSearchParams(
        Object.fromEntries(
            Object.entries(parsed)
                .filter(([k, v]) => k !== "pages" && v != null)
                .map(([k, v]) => [
                    k,
                    typeof v === "object" ? JSON.stringify(v) : String(v),
                ]),
        ),
    );

    const url = new URL(baseUrl);
    url.search = params.toString();
    return url.toString();
}
