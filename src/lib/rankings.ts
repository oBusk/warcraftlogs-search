import { gql } from "graphql-request";
import { getClient } from "./client";

interface Ranking {
    name: string;
    class: string;
    spec: string;
    amount: number;
    hardModeLevel: number;
    duration: number;
    startTime: number;
    report: {
        code: string;
        fightID: number;
        startTime: number;
    };
    guild: {
        id: number;
        name: string;
        faction: number;
    };
    server: {
        id: number;
        name: string;
        region: string;
    };
    bracketData: number;
    faction: number;
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
    query getRankings($encounterID: Int!) {
        worldData {
            encounter(id: $encounterID) {
                characterRankings
            }
        }
    }
`;

export default async function getRankings(encounterID: number) {
    const client = await getClient();

    const data = await client.request<Data>(getRankingsQuery, {
        encounterID,
    });

    const {
        worldData: {
            encounter: { characterRankings },
        },
    } = data;

    return characterRankings;
}
