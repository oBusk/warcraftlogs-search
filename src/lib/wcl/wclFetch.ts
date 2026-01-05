import { ApiAuthenticationError } from "../Errors";

const ROOT = "https://www.warcraftlogs.com/";
const AUTH_URL = `${ROOT}oauth/token` as const;
const API_URL = `${ROOT}api/v2/client` as const;

async function getWclToken() {
    if (!process.env.WCL_CLIENT_ID || !process.env.WCL_CLIENT_SECRET) {
        throw new ApiAuthenticationError(
            "WCL_CLIENT_ID or WCL_CLIENT_SECRET not set",
        );
    }

    const result = await fetch(AUTH_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
                `${process.env.WCL_CLIENT_ID}:${process.env.WCL_CLIENT_SECRET}`,
            ).toString("base64")}`,
        },
        body: new URLSearchParams({ grant_type: "client_credentials" }),
    });

    if (result.status === 200) {
        const body: {
            token_type: string;
            expires_in: number;
            access_token: string;
        } = await result.json();

        return body;
    } else {
        const errorText = await result.text();

        console.error("getWclToken failed", {
            status: result.status,
            errorText,
        });

        throw new ApiAuthenticationError(
            `WCL auth failed with status ${result.status}`,
        );
    }
}

export async function wclFetch<T>(
    query: string,
    variables?: Record<string, unknown>,
): Promise<T> {
    const token = await getWclToken();

    const result = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${token.token_type} ${token.access_token}`,
        },
        body: JSON.stringify({
            query,
            ...(variables && { variables }),
        }),
        next: { revalidate: 18000 },
    });

    const body: {
        data: T;
    } = await result.json();

    return body.data;
}
