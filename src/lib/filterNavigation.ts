import { type ParsedParams, parseParams, toParams } from "./Params";
import { removeNonCanonicalParams } from "./seo-utils";
import { createUrl } from "./utils";

type CurrentParams = Parameters<typeof parseParams>[0];

export function buildUrl(
    current: CurrentParams,
    params: Partial<ParsedParams>,
    { canonical = false } = {},
): string {
    const newParams = toParams(
        {
            ...parseParams(current),
            ...params,
        },
        {
            pruneDefaults: !canonical,
        },
    );

    if (canonical) {
        removeNonCanonicalParams(newParams);
    }

    return createUrl(".", newParams);
}

/**
 * The URL a filter change should navigate to, or `null` when the change is a
 * no-op and should produce neither a fetch nor a history entry.
 *
 * A change to anything other than `page` returns to the first page. Carrying
 * the page across a filter change lands the user at an arbitrary depth in a
 * result set they have never seen, or on an empty page, with no explanation.
 */
export function resolveFilterNavigation(
    current: CurrentParams,
    params: Partial<ParsedParams>,
): string | null {
    if (buildUrl(current, params) === buildUrl(current, {})) {
        return null;
    }

    return buildUrl(
        current,
        "page" in params ? params : { ...params, page: 1 },
    );
}
