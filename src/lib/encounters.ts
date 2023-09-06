import { gql } from "graphql-request";
import { getClient } from "^/lib/client";

export interface Encounter {
    id: number;
    name: string;
}

const getEncountersQuery = gql`
    query getEncounters($zoneId: Int!) {
        worldData {
            zone(id: $zoneId) {
                encounters {
                    name
                    id
                }
            }
        }
    }
`;

export async function getEncounters(zoneId: number) {
    const client = await getClient();

    const {
        worldData: {
            zone: { encounters },
        },
    } = await client.request<{
        worldData: { zone: { encounters: Encounter[] } };
    }>(getEncountersQuery, {
        zoneId,
    });

    return encounters;
}
