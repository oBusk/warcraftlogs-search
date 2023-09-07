import { wclFetch } from "./wclFetch";

export interface Zone {
    id: number;
    name: string;
}

export async function getZones() {
    const {
        worldData: { zones },
    } = await wclFetch<{
        worldData: {
            zones: Zone[];
        };
    }>(/* GraphQL */ `
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
