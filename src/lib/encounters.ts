import { wclFetch } from "./wclFetch";

export interface Encounter {
    id: number;
    name: string;
}

const getEncountersQuery = /* GraphQL */ `
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
    const {
        worldData: {
            zone: { encounters },
        },
    } = await wclFetch<{
        worldData: { zone: { encounters: Encounter[] } };
    }>(getEncountersQuery, {
        zoneId,
    });

    return encounters;
}
