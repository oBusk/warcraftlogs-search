"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ReactEventHandler } from "react";
import { PARAM_NAMES } from "^/lib/PARAM_NAMES";
import { createUrl } from "^/lib/utils";
import type { Zone } from "^/lib/wcl/zones";

export interface EncounterPickerProps {
    zones: Zone[];
}

export default function EncounterPicker({ zones }: EncounterPickerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const zone = searchParams.get(PARAM_NAMES.zone);

    if (zone == null) {
        return null;
    }
    const encounters = zones.find((z) => z.id === Number(zone))?.encounters;

    if (encounters == null) {
        throw new Error(`Zone ${zone} has no encounters`);
    }

    const encounter = searchParams.get(PARAM_NAMES.encounter);

    const onChange: ReactEventHandler<HTMLSelectElement> = (e) => {
        const val = e.target as HTMLSelectElement;
        const encounter = val.value;
        const newParams = new URLSearchParams(searchParams.toString());

        if (encounter) {
            newParams.set(PARAM_NAMES.encounter, encounter);
        } else {
            newParams.delete(PARAM_NAMES.encounter);
        }

        router.push(createUrl(".", newParams));
    };

    return (
        <select onChange={onChange} value={encounter ?? ""}>
            <option value="" disabled>
                Select an encounter
            </option>
            {encounters.map((encounter) => (
                <option key={encounter.id} value={encounter.id}>
                    {encounter.name}
                </option>
            ))}
        </select>
    );
}
