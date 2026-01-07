import { cacheLife } from "next/cache";
import type NameId from "../NameId";
import { wclFetch } from "./wclFetch";

export interface Partition extends NameId {}

export interface Encounter extends NameId {}

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
    "use cache";

    cacheLife("patch");

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
