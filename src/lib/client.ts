import { GraphQLClient } from "graphql-request";
import { cache } from "react";

const ROOT = "https://www.warcraftlogs.com/";
const AUTH_URL = `${ROOT}oauth/token` as const;
const API_URL = `${ROOT}api/v2/client` as const;

let client: GraphQLClient | null = null;

const createClient = async () => {
    const response = await fetch(AUTH_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
                `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`,
            ).toString("base64")}`,
        },
        body: new URLSearchParams({
            grant_type: "client_credentials",
        }),
    });

    const json: {
        token_type: string;
        expires_in: number;
        access_token: string;
    } = await response.json();

    return new GraphQLClient(API_URL, {
        headers: {
            Authorization: `${json.token_type} ${json.access_token}`,
        },
    });
};

export const getClient = cache(async function getClient() {
    if (!client) {
        client = await createClient();
    }

    return client;
});
