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

const expansionsQuery = /* GraphQL */ `
    query getExpansions {
        worldData {
            expansions {
                id
                name
            }
        }
    }
`;

const zonesQuery = /* GraphQL */ `
    query getZones($expansionId: Int!) {
        worldData {
            zones(expansion_id: $expansionId) {
                ...Zone
            }
        }
    }
    ${Zone}
`;

async function getExpansions() {
    "use cache: remote";

    cacheLife("expansion");

    const {
        worldData: { expansions },
    } = await wclFetch<{
        worldData: {
            expansions: { id: number; name: string }[];
        };
    }>(expansionsQuery);

    // Newest expansion first.
    return [...expansions].sort((a, b) => b.id - a.id);
}

export async function getZones() {
    "use cache: remote";

    cacheLife("patch");

    // Walk expansions newest-first and return the zones of the most recent one
    // that actually has any. This keeps the tool pointed at current content
    // without hardcoding an expansion id, and gracefully skips a next
    // expansion that Warcraft Logs may list before it has any logged zones.
    const expansions = await getExpansions();

    for (const { id } of expansions) {
        const {
            worldData: { zones },
        } = await wclFetch<{
            worldData: {
                zones: Zone[];
            };
        }>(zonesQuery, { expansionId: id });

        if (zones.length > 0) {
            return zones.map(({ partitions, ...zone }) => ({
                ...zone,
                partitions: partitions.reverse(),
            }));
        }
    }

    return [];
}
