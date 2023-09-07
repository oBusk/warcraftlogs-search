import { wclFetch } from "./wclFetch";

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
    const {
        worldData: {
            zone: { partitions },
        },
    } = await wclFetch<{
        worldData: { zone: { partitions: Partition[] } };
    }>(getPartitionsQuery, {
        zoneId,
    });

    return partitions;
}
