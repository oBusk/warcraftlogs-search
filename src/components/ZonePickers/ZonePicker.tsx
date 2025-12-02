"use client";

import Link from "next/link";
import { useParsedParams } from "^/lib/useParsedParams";
import type { Zone } from "^/lib/wcl/zones";
import DropdownFilter from "../DropdownFilter";

export interface ZonePickerProps {
    zones: Zone[];
}

export default function ZonePicker({ zones }: ZonePickerProps) {
    const { zone, setParams, buildCanonicalUrl } = useParsedParams();

    return (
        <>
            <DropdownFilter
                tooltip="Zone"
                options={zones.map((z) => ({
                    label: z.name,
                    value: String(z.id),
                }))}
                selected={zone ? String(zone) : ""}
                key={zone}
                setSelected={(zone) => {
                    const { encounters, difficulties } =
                        zones.find((z) => z.id === Number(zone)) ?? {};

                    const firstEncounter = encounters?.[0];

                    const difficulty = difficulties?.find((d) => d.id === 5)
                        ? 5
                        : difficulties?.[0].id;

                    setParams({
                        zone: Number(zone),
                        partition: undefined,
                        encounter: firstEncounter?.id,
                        difficulty,
                    });
                }}
            />
            <ul className="hidden">
                {zones.map((z) => (
                    <li key={z.id}>
                        <Link href={buildCanonicalUrl({ zone: z.id })}>
                            {z.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
}
