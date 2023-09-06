import { ReadonlyURLSearchParams } from "next/navigation";

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
