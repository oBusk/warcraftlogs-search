import type NameId from "../NameId";
import { wclFetch } from "./wclFetch";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Partition extends NameId {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Encounter extends NameId {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Difficulty extends NameId {}

export interface Zone extends NameId {
    partitions: Partition[];
    encounters: Encounter[];
    difficulties: Difficulty[];
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
        difficulties {
            id
            name
        }
    }
`;

const query = /* GraphQL */ `
    query getZones {
        worldData {
            zones(expansion_id: 6) {
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

    return zones.map(({ partitions, ...zone }) => ({
        ...zone,
        partitions: partitions.reverse(),
    }));
}
