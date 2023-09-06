import { gql } from "graphql-request";
import Link from "next/link";
import getClient from "^/lib/client";

export default async function Home() {
    const client = await getClient();

    const result = await client.request<{
        worldData: {
            zones: {
                id: number;
                name: string;
            }[];
        };
    }>(gql`
        query {
            worldData {
                zones(expansion_id: 5) {
                    id
                    name
                }
            }
        }
    `);

    return (
        <div>
            <h1>Dragonflight</h1>
            <ul>
                {result.worldData.zones.map((zone) => (
                    <li key={zone.id}>
                        <Link href={`/${zone.id}`}>{zone.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
