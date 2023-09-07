import { measuredPromise } from "./utils";

const ROOT = "https://www.warcraftlogs.com/";
const AUTH_URL = `${ROOT}oauth/token` as const;
const API_URL = `${ROOT}api/v2/client` as const;

export async function getToken() {
    const { result, time } = await measuredPromise(
        fetch(AUTH_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(
                    `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`,
                ).toString("base64")}`,
            },
            body: new URLSearchParams({ grant_type: "client_credentials" }),
        }),
    );

    console.log("getToken", {
        time,
    });

    const body: {
        token_type: string;
        expires_in: number;
        access_token: string;
    } = await result.json();

    return body;
}

export async function wclFetch<T>(
    query: string,
    variables?: Record<string, unknown>,
    cache: RequestCache = "default",
): Promise<T> {
    const token = await getToken();

    const { result, time } = await measuredPromise(
        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token.token_type} ${token.access_token}`,
            },
            body: JSON.stringify({
                query,
                ...(variables && { variables }),
            }),
            cache,
        }),
    );

    console.log("wclFetch", {
        time,
        query: /query (\w+)/.exec(query)?.[1],
        requestedCache: cache,
        headers: Array.from(result.headers.keys()).reduce(
            (acc, key) => {
                acc[key] = result.headers.get(key);
                return acc;
            },
            {} as Record<string, string | null>,
        ),
    });

    const body: {
        data: T;
    } = await result.json();

    return body.data;
}
