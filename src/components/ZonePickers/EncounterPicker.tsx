"use client";

import type { ReactEventHandler } from "react";
import { useParsedParams } from "^/lib/Params";
import type { Zone } from "^/lib/wcl/zones";

export interface EncounterPickerProps {
    zones: Zone[];
}

export default function EncounterPicker({ zones }: EncounterPickerProps) {
    const { zone, encounter, setParams } = useParsedParams();

    if (zone == null) {
        return null;
    }
    const encounters = zones.find((z) => z.id === Number(zone))?.encounters;

    if (encounters == null) {
        throw new Error(`Zone ${zone} has no encounters`);
    }

    const onChange: ReactEventHandler<HTMLSelectElement> = (e) => {
        const val = e.target as HTMLSelectElement;
        const encounter = val.value;

        setParams({
            encounter: Number(encounter),
        });
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
