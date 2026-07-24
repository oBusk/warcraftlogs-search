interface Report {
    code: string;
    fightID: number;
    startTime: number;
}

interface Guild {
    name: string;
}

interface Talent {
    name: string;
    talentID: number;
}

interface Gem {
    id: string;
}

interface Gear {
    name: string;
    id: number;
    bonusIDs: string[];
    gems?: Gem[];
    permanentEnchant?: string;
    temporaryEnchant?: string;
}

export interface Ranking {
    name: string;
    class: string;
    spec: string;
    amount: number;
    report: Report;
    guild: Guild | null;
    talents: Talent[];
    gear: Gear[];
}

export interface ErrorPayload {
    error: string;
}

export function isErrorPayload(obj: unknown): obj is ErrorPayload {
    return typeof obj === "object" && obj !== null && "error" in obj;
}

export interface CharacterRankings {
    page: number;
    hasMorePages: boolean;
    count: number;
    rankings: Ranking[];
}

/**
 * `characterRankings` is an opaque JSON scalar, so the fields we do not use
 * can only be dropped after the fact rather than deselected in the query.
 */
export function trimCharacterRankings({
    page,
    hasMorePages,
    count,
    rankings,
}: CharacterRankings): CharacterRankings {
    return {
        page,
        hasMorePages,
        count,
        rankings: rankings.map(
            ({
                name,
                class: className,
                spec,
                amount,
                report: { code, fightID, startTime },
                guild,
                talents,
                gear,
            }): Ranking => ({
                name,
                class: className,
                spec,
                amount,
                report: { code, fightID, startTime },
                guild: guild ? { name: guild.name } : null,
                talents:
                    talents?.map(({ name, talentID }) => ({
                        name,
                        talentID,
                    })) ?? [],
                gear:
                    gear?.map(
                        ({
                            id,
                            name,
                            bonusIDs,
                            gems,
                            permanentEnchant,
                            temporaryEnchant,
                        }) => ({
                            id,
                            name,
                            bonusIDs,
                            gems: gems?.map(({ id }) => ({ id })),
                            permanentEnchant,
                            temporaryEnchant,
                        }),
                    ) ?? [],
            }),
        ),
    };
}
