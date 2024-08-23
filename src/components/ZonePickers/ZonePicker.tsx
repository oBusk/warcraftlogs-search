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
            setSelected={(zone) =>
                setParams({
                    zone: Number(zone),
                    partition: undefined,
                    encounter: undefined,
                    difficulty: undefined,
                })
            }
        />
    );
}
