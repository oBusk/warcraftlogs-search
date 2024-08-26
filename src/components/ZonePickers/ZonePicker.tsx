"use client";

import { useParsedParams } from "^/lib/useParsedParams";
import type { Zone } from "^/lib/wcl/zones";
import DropdownFilter from "../DropdownFilter";

export interface ZonePickerProps {
    zones: Zone[];
}

export default function ZonePicker({ zones }: ZonePickerProps) {
    const { zone, setParams } = useParsedParams();

    return (
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
    );
}
