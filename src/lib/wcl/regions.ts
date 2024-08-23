import type NameId from "../NameId";
import { wclFetch } from "./wclFetch";

export interface Region extends NameId {
    /** E.g. `US`, `EU` */
    slug: string;
}

export async function getRegions() {
    const {
        worldData: { regions },
    } = await wclFetch<{
        worldData: {
            regions: Region[];
        };
    }>(/* GraphQL */ `
        query getRegions {
            worldData {
                regions {
                    name
                    id
                    slug
                }
            }
        }
    `);

    return regions;
}
