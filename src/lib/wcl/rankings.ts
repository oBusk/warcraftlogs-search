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

interface NullCharacterRankings extends Omit<CharacterRankings, "page"> {
    filteredCount: number;
    pages: number[];
}

const getRankingsQuery = /* GraphQL */ `
    query getRankings(
        $encounterID: Int!
        $partition: Int
        $klassName: String
        $specName: String
        $page: Int!
    ) {
        worldData {
            encounter(id: $encounterID) {
                characterRankings(
                    includeCombatantInfo: true
                    partition: $partition
                    className: $klassName
                    specName: $specName
                    page: $page
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
    pages: number[] = [1],
): Promise<NullCharacterRankings> {
    let klassName: string | undefined;
    let specName: string | undefined;

    if (klass != null) {
        const { slug, specs } = await getClass(klass);

        klassName = slug;

        if (spec != null) {
            specName = specs.find(({ id }) => `${id}` === `${spec}`)?.name;
        }
    }

    const characterRankings = (
        await Promise.all(
            pages.map((p) =>
                wclFetch<Data>(getRankingsQuery, {
                    encounterID,
                    partition,
                    klassName,
                    specName,
                    page: p,
                }),
            ),
        )
    )
        .map(
            ({
                worldData: {
                    encounter: { characterRankings },
                },
            }) => characterRankings,
        )
        .reduce(
            (acc, rankings) => ({
                pages: [...acc.pages, rankings.page],
                count: acc.count + rankings.count,
                hasMorePages: acc.hasMorePages && rankings.hasMorePages,
                rankings: [...acc.rankings, ...rankings.rankings],
            }),
            {
                pages: new Array<number>(),
                count: 0,
                hasMorePages: true,
                rankings: new Array<Ranking>(),
            },
        );

    if (talent != null) {
        const rankings = characterRankings.rankings.filter(({ talents }) => {
            return talents.some(
                ({ id, talentID }) => id === talent || talentID === talent,
            );
        });

        return {
            ...characterRankings,
            filteredCount: rankings.length,
            rankings,
        };
    }
    return {
        ...characterRankings,
        filteredCount: characterRankings.count,
    };
}
