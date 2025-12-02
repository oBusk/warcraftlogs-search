import { type ParsedParams, parseParams, type RawParams } from "./Params";

/**
 * Generates a canonical URL by removing the 'pages' parameter while preserving other parameters.
 *
 * @param {RawParams | ParsedParams} paramsOrRaw - The raw or parsed search parameters to use
 * @param {string} baseUrl - The base URL (defaults to "https://wcl.nulldozzer.io")
 * @returns {string} The canonical URL with query parameters
 */
export function generateCanonicalUrl(
    paramsOrRaw: RawParams | ParsedParams | Partial<ParsedParams>,
    baseUrl = "https://wcl.nulldozzer.io",
): string {
    // Parse if needed
    const parsed =
        typeof paramsOrRaw === "object" &&
        "classId" in paramsOrRaw &&
        typeof paramsOrRaw.classId !== "string"
            ? paramsOrRaw
            : parseParams(paramsOrRaw as RawParams);

    const params = new URLSearchParams(
        Object.fromEntries(
            Object.entries(parsed)
                .filter(
                    ([k, v]) =>
                        k !== "pages" &&
                        v != null &&
                        (!Array.isArray(v) || v.length > 0),
                )
                .map(([k, v]) => [
                    k,
                    typeof v === "object" ? JSON.stringify(v) : String(v),
                ]),
        ),
    );

    const paramsString = params.toString();
    const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

    // For relative paths, concatenate directly; for absolute URLs, use URL constructor
    if (baseUrl.startsWith("http://") || baseUrl.startsWith("https://")) {
        const url = new URL(baseUrl);
        url.search = params.toString();
        return url.toString();
    } else {
        return `${baseUrl}${queryString}`;
    }
}
