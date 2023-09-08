"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ReactEventHandler } from "react";
import { createUrl } from "^/lib/utils";
import type { Zone } from "^/lib/wcl/zones";

export interface PartitionPickerProps {
    zones: Zone[];
}

export default function PartitionPicker({ zones }: PartitionPickerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const zone = searchParams.get("zone");

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

    const partition = searchParams.get("partition");

    const onChange: ReactEventHandler<HTMLSelectElement> = (e) => {
        const val = e.target as HTMLSelectElement;
        const partition = val.value;
        const newParams = new URLSearchParams(searchParams.toString());

        if (partition) {
            newParams.set("partition", partition);
        } else {
            newParams.delete("partition");
        }

        router.push(createUrl(".", newParams));
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
