"use client";

import type { ReactEventHandler } from "react";
import { useParsedParams } from "^/lib/Params";
import type { Zone } from "^/lib/wcl/zones";

export interface PartitionPickerProps {
    zones: Zone[];
}

export default function PartitionPicker({ zones }: PartitionPickerProps) {
    const { zone, partition, setParams } = useParsedParams();

    if (zone == null) {
        return null;
    }

    const partitions = zones.find((z) => z.id === Number(zone))?.partitions;
    if (partitions == null) {
        throw new Error(`Zone ${zone} has no partitions`);
    }

    if (partitions.length === 1) {
        return null;
    }

    const onChange: ReactEventHandler<HTMLSelectElement> = (e) => {
        const val = e.target as HTMLSelectElement;
        const partition = val.value;

        setParams({
            partition: Number(partition),
        });
    };

    return (
        <select onChange={onChange} value={partition ?? partitions[0].id}>
            {partitions.map((partition) => (
                <option key={partition.id} value={partition.id}>
                    {partition.name}
                </option>
            ))}
        </select>
    );
}
