import { unstable_cache } from "next/cache";
import { type ItemFilterConfig } from "^/components/ItemPicker/ItemFilter";
import { type TalentFilterConfig } from "^/components/TalentPicker/TalentFilter";
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
        $encounter: Int!
        $difficulty: Int!
        $klassName: String
        $page: Int!
        $partition: Int
        $metric: CharacterRankingMetricType
        $region: String
        $specName: String
    ) {
        worldData {
            encounter(id: $encounter) {
                characterRankings(
                    includeCombatantInfo: true
                    difficulty: $difficulty
                    className: $klassName
                    page: $page
                    partition: $partition
                    metric: $metric
                    serverRegion: $region
                    specName: $specName
                )
            }
        }
    }
`;

async function _getRankings({
    difficulty,
    encounter,
    klass,
    pages,
    partition,
    metric,
    region,
    spec,
    talents: talentFilters,
    itemFilters,
}: {
    difficulty: number;
    encounter: number;
    klass: number | null;
    pages: readonly number[];
    partition: number | null;
    metric: string;
    region: string | null;
    spec: number | null;
    talents: TalentFilterConfig[];
    itemFilters: ItemFilterConfig[];
}): Promise<NullCharacterRankings> {
    let klassName: string | undefined;
    let specName: string | undefined;

    if (klass != null) {
        const { slug, specs } = await getClass(klass);

        klassName = slug;

        if (spec != null) {
            specName = specs.find(({ id }) => `${id}` === `${spec}`)?.name;
        }
    }

    let characterRankings = (
        await Promise.all(
            pages.map((p) =>
                wclFetch<Data>(getRankingsQuery, {
                    encounter,
                    partition,
                    metric,
                    difficulty,
                    klassName,
                    specName,
                    page: p,
                    region,
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
            (acc, rankings) =>
                rankings == null
                    ? acc
                    : {
                          pages: [...acc.pages, rankings.page],
                          count: acc.count + rankings.count,
                          filteredCount: acc.filteredCount + rankings.count,
                          hasMorePages:
                              acc.hasMorePages && rankings.hasMorePages,
                          rankings: [...acc.rankings, ...rankings.rankings],
                      },
            {
                pages: new Array<number>(),
                count: 0,
                filteredCount: 0,
                hasMorePages: true,
                rankings: new Array<Ranking>(),
            },
        );

    if (talentFilters.length > 0) {
        const rankings = characterRankings.rankings.reduce((acc, ranking) => {
            const matches = talentFilters.every((filter) =>
                ranking.talents.some((talent) =>
                    filter.talentId
                        ? `${talent.talentID}` === filter.talentId
                        : filter.name
                          ? talent.name
                                .toLowerCase()
                                .includes(filter.name.toLowerCase())
                          : false,
                ),
            );

            if (matches) {
                return [...acc, ranking];
            }

            return acc;
        }, new Array<Ranking>());

        characterRankings = {
            ...characterRankings,
            filteredCount: rankings.length,
            rankings,
        };
    }

    if (itemFilters.length > 0) {
        const rankings = characterRankings.rankings.reduce((acc, ranking) => {
            const matches = itemFilters.every((filter) =>
                ranking.gear.some((gear) => {
                    if (filter.id) {
                        if (`${gear.id}` !== filter.id) {
                            return false;
                        }
                    } else if (filter.name) {
                        if (
                            !gear.name
                                .toLowerCase()
                                .includes(filter.name.toLowerCase())
                        ) {
                            return false;
                        }
                    }

                    if (filter.permanentEnchant) {
                        if (gear.permanentEnchant !== filter.permanentEnchant) {
                            return false;
                        }
                    }

                    if (filter.temporaryEnchant) {
                        if (gear.temporaryEnchant !== filter.temporaryEnchant) {
                            return false;
                        }
                    }

                    if (filter.gemId) {
                        if (!gear.gems?.some(({ id }) => id === filter.gemId)) {
                            return false;
                        }
                    }

                    if (filter.bonusId) {
                        if (
                            !gear.bonusIDs.some(
                                (bonusId) => bonusId === filter.bonusId,
                            )
                        ) {
                            return false;
                        }
                    }

                    return true;
                }),
            );

            if (matches) {
                return [...acc, ranking];
            }

            return acc;
        }, new Array<Ranking>());

        characterRankings = {
            ...characterRankings,
            filteredCount: rankings.length,
            rankings,
        };
    }

    return characterRankings;
}

// Cache rankings for 1 hour with a dynamic cache key based on all parameters
// This caches the expensive WCL API calls and filtering logic
export default function getRankings(params: {
    difficulty: number;
    encounter: number;
    klass: number | null;
    pages: readonly number[];
    partition: number | null;
    metric: string;
    region: string | null;
    spec: number | null;
    talents: TalentFilterConfig[];
    itemFilters: ItemFilterConfig[];
}): Promise<NullCharacterRankings> {
    // Create a stable cache key from all parameters that affect the result
    const cacheKey = [
        "wcl-rankings",
        String(params.encounter),
        String(params.difficulty),
        String(params.klass ?? "all"),
        String(params.spec ?? "all"),
        String(params.partition ?? "latest"),
        params.metric,
        params.region ?? "all",
        params.pages.join(","),
        // Serialize talents and items for cache key
        params.talents.map((t) => `${t.talentId || t.name}`).join(","),
        params.itemFilters
            .map(
                (i) =>
                    `${i.id || i.name}-${i.permanentEnchant || ""}-${i.temporaryEnchant || ""}-${i.gemId || ""}-${i.bonusId || ""}`,
            )
            .join(","),
    ];

    // Use unstable_cache with a dynamically generated key
    return unstable_cache(() => _getRankings(params), cacheKey, {
        revalidate: 3600, // 1 hour - rankings change but not too frequently
        tags: ["wcl-rankings"],
    })();
}
