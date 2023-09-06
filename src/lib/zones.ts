import { gql } from "graphql-request";
import { getClient } from "./client";

export interface Zone {
    id: number;
    name: string;
}

export async function getZones() {
    const client = await getClient();

    const {
        worldData: { zones },
    } = await client.request<{
        worldData: {
            zones: Zone[];
        };
    }>(gql`
        query {
            worldData {
                zones(expansion_id: 5) {
                    id
                    name
                }
            }
        }
    `);

    return zones;
}
