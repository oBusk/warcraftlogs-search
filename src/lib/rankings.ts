import { gql } from "graphql-request";
import { getClient } from "./client";

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

const getRankingsQuery = gql`
    query getRankings($encounterID: Int!, $partition: Int, $wowClass: String) {
        worldData {
            encounter(id: $encounterID) {
                characterRankings(
                    includeCombatantInfo: true
                    partition: $partition
                    className: $wowClass
                )
            }
        }
    }
`;

export default async function getRankings(
    encounterID: number,
    partition?: number,
    wowClass?: string,
) {
    const client = await getClient();

    const data = await client.request<Data>(getRankingsQuery, {
        encounterID,
        partition,
        wowClass: wowClass,
    });

    const {
        worldData: {
            encounter: { characterRankings },
        },
    } = data;

    return characterRankings;
}
