import { gql } from "graphql-request";
import Link from "next/link";
import getClient from "^/lib/client";

export default async function Bosses({
    params: { zoneId, partitionId },
}: {
    params: { zoneId: number; partitionId: number };
}) {
    const client = await getClient();

    const {
        worldData: {
            zone: { name, encounters },
        },
    } = await client.request<{
        worldData: {
            zone: {
                name: string;
                encounters: {
                    name: string;
                    id: number;
                }[];
            };
        };
    }>(gql`
        query {
            worldData {
                zone(id: ${zoneId}) {
                    name
                    encounters {
                        name
                        id
                    }
                }
            }
        }
    `);

    return (
        <>
            <h1>{name}</h1>
            <ul>
                {encounters.map((encounter) => (
                    <li key={encounter.id}>
                        <Link href={[partitionId, encounter.id].join("/")}>
                            {encounter.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
}
