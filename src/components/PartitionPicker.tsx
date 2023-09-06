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
    let partitions = await getPartitions(zone);

    // Most recent partition first
    partitions = partitions.reverse();

    return (
        <PartitionPickerClient partitions={partitions} partition={partition} />
    );
}
