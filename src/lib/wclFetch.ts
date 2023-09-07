const ROOT = "https://www.warcraftlogs.com/";
const AUTH_URL = `${ROOT}oauth/token` as const;
const API_URL = `${ROOT}api/v2/client` as const;

export function getToken() {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
                `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`,
            ).toString("base64")}`,
        },
        body: new URLSearchParams({ grant_type: "client_credentials" }),
    };

    return fetch(AUTH_URL, options).then(
        (response) =>
            response.json() as Promise<{
                token_type: string;
                expires_in: number;
                access_token: string;
            }>,
    );
}

export async function wclFetch<T>(
    query: string,
    variables?: Record<string, unknown>,
): Promise<T> {
    const token = await getToken();

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
        cache: "no-cache",
    });

    const body = await result.json();

    return body.data;
}
