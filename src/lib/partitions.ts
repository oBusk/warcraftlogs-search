import { getClient } from "./client";

export interface Partition {
    id: number;
    name: string;
}

const getPartitionsQuery = /* GraphQL */ `
    query getPartitions($zoneId: Int!) {
        worldData {
            zone(id: $zoneId) {
                partitions {
                    id
                    name
                }
            }
        }
    }
`;

export async function getPartitions(zoneId: number) {
    const client = await getClient();

    const {
        worldData: {
            zone: { partitions },
        },
    } = await client.request<{
        worldData: { zone: { partitions: Partition[] } };
    }>(getPartitionsQuery, {
        zoneId,
    });

    return partitions;
}
