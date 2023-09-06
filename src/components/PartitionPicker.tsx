import { getPartitions } from "^/lib/partitions";
import PartitionPickerClient from "./PartitionPicker.client";

export interface PartitionPickerProps {
    zone: number;
    partition?: number;
}

export default async function PartitionPicker({
    zone,
    partition,
}: PartitionPickerProps) {
    const partitions = await getPartitions(zone);

    return (
        <PartitionPickerClient partitions={partitions} partition={partition} />
    );
}
