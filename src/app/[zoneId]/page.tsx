import { gql } from "graphql-request";
import Link from "next/link";
import getClient from "^/lib/client";

export default async function Partitions({
    params: { zoneId },
}: {
    params: { zoneId: string };
}) {
    const client = await getClient();

    const {
        worldData: {
            zone: { name, partitions },
        },
    } = await client.request<{
        worldData: {
            zone: {
                name: string;
                partitions: {
                    id: number;
                    name: string;
                }[];
            };
        };
    }>(gql`
        query {
            worldData {
                zone(id: ${zoneId}) {
                    name
                    partitions {
                        id
                        name
                    }
                }
            }
        }
    `);

    return (
        <div>
            <h1>{name}</h1>
            <ul>
                {partitions.map((partition) => (
                    <li key={partition.id}>
                        <Link href={`${zoneId}/${partition.id}`}>
                            {partition.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
