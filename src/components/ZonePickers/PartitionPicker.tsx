"use client";

import Link from "next/link";
import { useParsedParams } from "^/lib/useParsedParams";
import type { Zone } from "^/lib/wcl/zones";
import DropdownFilter from "../DropdownFilter";

export interface PartitionPickerProps {
    zones: Zone[];
}

export default function PartitionPicker({ zones }: PartitionPickerProps) {
    const { zone, partition, setParams, buildUrl } = useParsedParams();

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

    return (
        <>
            <DropdownFilter
                tooltip="Partition"
                options={partitions.map((p) => ({
                    label: p.name,
                    value: String(p.id),
                }))}
                selected={partition ? String(partition) : ""}
                key={partition}
                setSelected={(partition) =>
                    setParams({ partition: Number(partition) })
                }
            />
            <ul className="hidden">
                {partitions.map((p) => (
                    <li key={p.id}>
                        <Link href={buildUrl({ partition: p.id })}>
                            {p.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
}
