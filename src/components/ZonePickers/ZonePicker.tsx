"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ReactEventHandler } from "react";
import { createUrl } from "^/lib/utils";
import type { Zone } from "^/lib/wcl/zones";

export interface ZonePickerProps {
    zones: Zone[];
}

export default function ZonePicker({ zones }: ZonePickerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const zone = searchParams.get("zone");

    const onChange: ReactEventHandler<HTMLSelectElement> = (e) => {
        const val = e.target as HTMLSelectElement;
        const zone = val.value;
        const newParams = new URLSearchParams(searchParams.toString());

        if (zone) {
            newParams.set("zone", zone);
        } else {
            newParams.delete("zone");
        }
        newParams.delete("encounter");
        newParams.delete("partition");

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
