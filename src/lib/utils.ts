import { type ReadonlyURLSearchParams } from "next/navigation";

export function createUrl(
    pathname: string,
    params: URLSearchParams | ReadonlyURLSearchParams,
) {
    const paramsString = params.toString();
    const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

    return `${pathname}${queryString}`;
}

export function buildWclUrl({
    code,
    fightID,
    type = "damage-done",
}: {
    code: string;
    fightID: number;
    type?: string;
}) {
    let url = `https://warcraftlogs.com/reports/${code}`;

    const hashParams = {
        ...(fightID ? { fight: fightID } : {}),
        ...(type ? { type } : {}),
    };

    if (Object.keys(hashParams).length) {
        url += `#${Object.entries(hashParams)
            .map(([key, value]) => `${key}=${value}`)
            .join("&")}`;
    }

    return url;
}

export async function measuredPromise<T>(source: Promise<T>): Promise<{
    result: T;
    time: number;
}> {
    const start = Date.now();
    const result = await source;
    return { result, time: Date.now() - start };
}

export function forceToNumber(
    value: string | string[] | undefined | null,
): number | undefined {
    if (value == null) {
        return undefined;
    }

    if (Array.isArray(value)) {
        return parseInt(value[0]);
    }

    return parseInt(value);
}

export function arrayEquals<T>(
    arr1: readonly T[],
    arr2: readonly T[],
    comparison = (a: T, b: T) => a === b,
): boolean {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (!comparison(arr1[i], arr2[i])) {
            return false;
        }
    }

    return true;
}

/**
 * Because `t => t != null` is not a type guard.
 */
export function isNotNull<T>(value: T | undefined | null): value is T {
    return value != null;
}
