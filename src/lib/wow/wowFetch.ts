import { ValueOf } from "next/dist/shared/lib/constants";
import { measuredPromise } from "../utils";
import { BnetError } from "./types";

const AUTH_URL = "https://oauth.battle.net/token";
export const NAMESPACES = {
    Static: `static-${process.env.BNET_REGION}`,
    Dynamic: `dynamic-${process.env.BNET_REGION}`,
    Profile: `profile-${process.env.BNET_REGION}`,
} as const;
const API_URL = `https://${process.env.BNET_REGION}.api.blizzard.com/data/wow`;

export async function getWowToken() {
    const { result, time } = await measuredPromise(
        fetch(AUTH_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(
                    `${process.env.BNET_CLIENT_ID}:${process.env.BNET_CLIENT_SECRET}`,
                ).toString("base64")}`,
            },
            body: new URLSearchParams({ grant_type: "client_credentials" }),
        }),
    );

    console.log("getWowToken", {
        time,
    });

    const body: {
        token_type: string;
        expires_in: number;
        access_token: string;
        sub: string;
    } = await result.json();

    return body;
}

export async function wowFetch<T>({
    endpoint,
    url = `${API_URL}/${endpoint}`,
    namespace,
}: {
    endpoint?: string;
    url?: string;
    namespace?: ValueOf<typeof NAMESPACES>;
}): Promise<T> {
    const token = await getWowToken();

    const urlObj = new URL(url);
    if (namespace) {
        urlObj.searchParams.delete("namespace");
        urlObj.searchParams.append("namespace", namespace);
    } else if (!urlObj.searchParams.has("namespace")) {
        throw "namespace not set";
    }
    urlObj.searchParams.append("locale", process.env.BNET_LOCALE ?? "en_GB");
    const init: RequestInit = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${token.token_type} ${token.access_token}`,
        },
    };

    let response: Response;
    let time: number;
    try {
        ({ result: response, time } = await measuredPromise(
            fetch(urlObj, init),
        ));
    } catch (e) {
        console.error("[wowFetch] Failed: Fetching", {
            url: urlObj.toString(),
            error: e,
        });

        throw e;
    }

    let text: string | undefined;
    let body: any;
    try {
        text = await response.text();
        body = JSON.parse(text);
    } catch (e) {
        console.error("[wowFetch] Failed: Parsing", {
            url: urlObj.toString(),
            time,
            error: e,
            text,
        });

        throw e;
    }

    if ((body as BnetError).code != null) {
        console.error("[wowFetch] Failed: Response contains errorcode", {
            url: urlObj.toString(),
            time,
            body: body,
        });

        throw body;
    }

    console.log("[wowFetch] Completed", {
        url: urlObj.toString(),
        time,
    });
    return body as T;
}
