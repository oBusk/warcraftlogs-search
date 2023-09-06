"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ReactEventHandler } from "react";
import type { Partition } from "^/lib/partitions";
import { createUrl } from "^/lib/utils";

export interface PartitionPickerProps {
    partitions: Partition[];
    partition?: number;
}

export default function PartitionPickerClient({
    partitions,
    partition,
}: PartitionPickerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

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
        <select onChange={onChange} value={partition ?? ""}>
            <option value="">Select a partition</option>
            {partitions.map((partition) => (
                <option key={partition.id} value={partition.id}>
                    {partition.name}
                </option>
            ))}
        </select>
    );
}
