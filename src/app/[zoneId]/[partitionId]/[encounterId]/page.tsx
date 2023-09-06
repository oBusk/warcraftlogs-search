import { gql } from "graphql-request";
import getClient from "^/lib/client";

const reportUrl = (id: string, fight: number) =>
    `https://warcraftlogs.com/reports/${id}#fight=${fight}&type=damage-done`;

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
    name: string;
    characterRankings: CharacterRankings;
}

interface Zone {
    name: string;
}

interface WorldData {
    zone: Zone;
    encounter: Encounter;
}

export default async function Rankings({
    params: { zoneId, partitionId, encounterId },
}: {
    params: { zoneId: number; partitionId: number; encounterId: number };
}) {
    const client = await getClient();

    const result = await client.request<{ worldData: WorldData }>(gql`
    query {
        worldData {
            zone(id: ${zoneId}) {
                name
            }
            encounter(id: ${encounterId}) {
                name
                characterRankings(partition: ${partitionId})
            }

        }
    }`);

    return (
        <>
            <h1>
                {result.worldData.zone.name} - {result.worldData.encounter.name}
            </h1>
            <table>
                <tbody>
                    {result.worldData.encounter.characterRankings.rankings.map(
                        (ranking) => (
                            <a
                                className="table-row"
                                href={reportUrl(
                                    ranking.report.code,
                                    ranking.report.fightID,
                                )}
                                key={ranking.report.code}
                                target="_blank"
                            >
                                <td>{ranking.name}</td>
                                <td>{ranking.spec}</td>
                                <td>{ranking.amount.toLocaleString()}</td>
                            </a>
                        ),
                    )}
                </tbody>
            </table>
        </>
    );
}
