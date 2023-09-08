"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ReactEventHandler } from "react";
import { PARAM_NAMES } from "^/lib/PARAM_NAMES";
import { createUrl } from "^/lib/utils";
import type { Zone } from "^/lib/wcl/zones";

export interface ZonePickerProps {
    zones: Zone[];
}

export default function ZonePicker({ zones }: ZonePickerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const zone = searchParams.get(PARAM_NAMES.zone);

    const onChange: ReactEventHandler<HTMLSelectElement> = (e) => {
        const val = e.target as HTMLSelectElement;
        const zone = val.value;
        const newParams = new URLSearchParams(searchParams.toString());

        if (zone) {
            newParams.set(PARAM_NAMES.zone, zone);
        } else {
            newParams.delete(PARAM_NAMES.zone);
        }
        newParams.delete(PARAM_NAMES.encounter);
        newParams.delete(PARAM_NAMES.partition);

        router.push(createUrl(".", newParams));
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
