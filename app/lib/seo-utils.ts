// src/lib/seo-utils.ts
// Utility functions for SEO-related URL handling

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
 * Generates a canonical URL by removing the 'pages' parameter while preserving other parameters.
 *
 * @param {SearchParams} searchParams - The search parameters to use
 * @param {string} baseUrl - The base URL (defaults to "https://wcl.nulldozzer.io")
 * @returns {string} The canonical URL with query parameters
 */
export function generateCanonicalUrl(
    searchParams: SearchParams,
    baseUrl = "https://wcl.nulldozzer.io",
): string {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
        if (key !== "pages" && value !== undefined) {
            if (Array.isArray(value)) {
                value.forEach((v) => params.append(key, v));
            } else {
                params.append(key, value);
            }
        }
    });

    const url = new URL(baseUrl);
    url.search = params.toString();
    return url.toString();
}
