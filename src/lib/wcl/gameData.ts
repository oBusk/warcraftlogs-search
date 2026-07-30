import { cacheLife } from "next/cache";

import type { Klass, WclClass } from "./classes";
import type { Region } from "./regions";
import { wclFetch } from "./wclFetch";
import type { Zone } from "./zones";

const ClassColors: Record<string, string> = {
    DeathKnight: "#C41E3A",
    DemonHunter: "#A330C9",
    Druid: "#FF7C0A",
    Evoker: "#33937F",
    Hunter: "#AAD372",
    Mage: "#3FC7EB",
    Monk: "#00FF98",
    Paladin: "#F48CBA",
    Priest: "#FFFFFF",
    Rogue: "#FFF468",
    Shaman: "#0070DD",
    Warlock: "#8788EE",
    Warrior: "#C69B6D",
};

const query = /* GraphQL */ `
    query getGameData {
        worldData {
            zones(expansion_id: 7) {
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
            regions {
                name
                slug
            }
        }
        gameData {
            classes {
                name
                slug
                id
                specs {
                    name
                    id
                }
            }
        }
    }
`;

export interface GameData {
    zones: Zone[];
    classes: Klass[];
    regions: Region[];
}

/**
 * Fetches every rarely-changing WCL dataset the search UI needs — zones,
 * classes and regions — in a single request and caches it as one Runtime Cache
 * entry. Every page render and every filter picker reads this, so keeping it as
 * one shared remote entry (rather than three) both minimises WCL requests and
 * keeps the per-render cache read count down.
 */
export async function getGameData(): Promise<GameData> {
    "use cache: remote";

    cacheLife("patch");

    const {
        worldData: { zones, regions },
        gameData: { classes },
    } = await wclFetch<{
        worldData: {
            zones: Zone[];
            regions: Region[];
        };
        gameData: {
            classes: WclClass[];
        };
    }>(query);

    const mappedZones = zones.map(({ partitions, ...zone }) => ({
        ...zone,
        partitions: partitions.reverse(),
    }));

    const mappedClasses = classes.map((wclClass) => ({
        ...wclClass,
        color: ClassColors[wclClass.slug],
    }));

    const gameData: GameData = {
        zones: mappedZones,
        classes: mappedClasses,
        regions,
    };

    console.log("[gamedata-cache] miss", {
        bytes: Buffer.byteLength(JSON.stringify(gameData)),
    });

    return gameData;
}
