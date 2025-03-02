import { measuredPromise } from "../utils";

const ROOT = "https://www.warcraftlogs.com/";
const AUTH_URL = `${ROOT}oauth/token` as const;
const API_URL = `${ROOT}api/v2/client` as const;

async function getWclToken() {
    if (!process.env.WCL_CLIENT_ID || !process.env.WCL_CLIENT_SECRET) {
        throw new Error("WCL_CLIENT_ID or WCL_CLIENT_SECRET not set");
    }

    const { result, time } = await measuredPromise(
        fetch(AUTH_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(
                    `${process.env.WCL_CLIENT_ID}:${process.env.WCL_CLIENT_SECRET}`,
                ).toString("base64")}`,
            },
            body: new URLSearchParams({ grant_type: "client_credentials" }),
            cache: "force-cache",
        }),
    );

    console.log("getWclToken", {
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
    cache: RequestCache = "force-cache",
): Promise<T> {
    const token = await getWclToken();

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
    });

    const body: {
        data: T;
    } = await result.json();

    return body.data;
}
