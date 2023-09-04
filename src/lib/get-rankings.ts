import { gql } from "graphql-request";
import client from "./client";

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

interface Encounter {
    characterRankings: CharacterRankings;
}

interface WorldData {
    encounter: Encounter;
}

interface Data {
    worldData: WorldData;
}

export default async function getRankings() {
    const graphQLClient = await client();

    const {
        worldData: {
            encounter: {
                characterRankings: { rankings },
            },
        },
    } = await graphQLClient.request<{ worldData: WorldData }>(gql`
        query {
            worldData {
                encounter(id: 2688) {
                    characterRankings(className: "Warrior")
                }
            }
        }
    `);

    return rankings;
}
