import { unstable_cache } from "next/cache";
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

async function _getZones() {
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

export const getZones = unstable_cache(_getZones, ["wcl-zones"], {
    revalidate: 86400, // 24 hours - zone/encounter data changes infrequently
    tags: ["wcl-zones"],
});
