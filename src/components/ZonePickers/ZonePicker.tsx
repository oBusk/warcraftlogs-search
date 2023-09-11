"use client";

import { ReactEventHandler } from "react";
import { useParsedParams } from "^/lib/Params";
import type { Zone } from "^/lib/wcl/zones";

export interface ZonePickerProps {
    zones: Zone[];
}

export default function ZonePicker({ zones }: ZonePickerProps) {
    const { zone, setParams } = useParsedParams();

    const onChange: ReactEventHandler<HTMLSelectElement> = (e) => {
        const val = e.target as HTMLSelectElement;
        const zone = val.value;

        setParams({
            zone: zone ? Number(zone) : undefined,
            encounter: undefined,
            partition: undefined,
        });
    };

    return (
        <select onChange={onChange} value={zone ?? ""}>
            <option value="" disabled>
                Select a zone
            </option>
            {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                    {zone.name}
                </option>
            ))}
        </select>
    );
}
