"use client";

import { useParsedParams } from "^/lib/Params";
import type { Zone } from "^/lib/wcl/zones";
import DropdownFilter from "../DropdownFilter";

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

    <DropdownFilter
        tooltip="Encounter"
        options={encounters.map((e) => ({
            label: e.name,
            value: String(e.id),
        }))}
        selected={encounter ? String(encounter) : ""}
        setSelected={(encounter) => setParams({ encounter: Number(encounter) })}
    />;
}
