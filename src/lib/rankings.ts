import { getClass } from "./classes";
import { wclFetch } from "./wclFetch";

interface Report {
    code: string;
    fightID: number;
    startTime: number;
}

interface Guild {
    id: number;
    name: string;
    faction: number;
}

interface Server {
    id: number;
    name: string;
    region: string;
}

interface Talent {
    name: string;
    id: number;
    talentID: number;
    points: number;
    icon: string;
}

interface Gem {
    id: string;
    itemLevel: string;
}

interface Gear {
    name: string;
    quality: string;
    id: number;
    icon: string;
    itemLevel: string;
    bonusIDs: string[];
    gems?: Gem[];
    permanentEnchant?: string;
    temporaryEnchant?: string;
}

interface Ranking {
    name: string;
    class: string;
    spec: string;
    amount: number;
    hardModeLevel: number;
    duration: number;
    startTime: number;
    report: Report;
    guild: Guild;
    server: Server;
    bracketData: number;
    faction: number;
    talents: Talent[];
    gear: Gear[];
}

interface CharacterRankings {
    page: number;
    hasMorePages: boolean;
    count: number;
    rankings: Ranking[];
}
interface Data {
    worldData: {
        encounter: {
            characterRankings: CharacterRankings;
        };
    };
}

const getRankingsQuery = /* GraphQL */ `
    query getRankings(
        $encounterID: Int!
        $partition: Int
        $klassName: String
        $specName: String
    ) {
        worldData {
            encounter(id: $encounterID) {
                characterRankings(
                    includeCombatantInfo: true
                    partition: $partition
                    className: $klassName
                    specName: $specName
                )
            }
        }
    }
`;

export default async function getRankings(
    encounterID: number,
    partition?: number,
    klass?: number,
    spec?: number,
    talent?: number,
) {
    let klassName: string | undefined;
    let specName: string | undefined;

    if (klass != null) {
        const { slug, specs } = await getClass(klass);

        klassName = slug;

        if (spec != null) {
            specName = specs.find(({ id }) => id === spec)?.name;
        }
    }

    const data = await wclFetch<Data>(getRankingsQuery, {
        encounterID,
        partition,
        klassName,
        specName,
    });

    const {
        worldData: {
            encounter: { characterRankings },
        },
    } = data;

    if (talent != null) {
        return {
            ...characterRankings,
            rankings: characterRankings.rankings.filter(({ talents }) => {
                return talents.some(({ talentID }) => talentID === talent);
            }),
        };
    }
    return characterRankings;
}
