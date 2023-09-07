import NameId from "./NameId";
import { wclFetch } from "./wclFetch";

export interface Partition extends NameId {}

export interface Encounter extends NameId {}

export interface Zone extends NameId {
    partitions: Partition[];
    encounters: Encounter[];
}

const Zone = /* GraphQL */ `
    fragment Zone on Zone {
        id
        name
        partitions {
            id
            name
        }
        encounters {
            id
            name
        }
    }
`;

const query = /* GraphQL */ `
    query {
        worldData {
            zones(expansion_id: 5) {
                ...Zone
            }
        }
    }
    ${Zone}
`;

export async function getZones() {
    const {
        worldData: { zones },
    } = await wclFetch<{
        worldData: {
            zones: Zone[];
        };
    }>(query);

    return zones;
}
