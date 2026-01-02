"use client";

import Link from "next/link";
import { MalformedUrlParameterError } from "^/lib/Errors";
import { useParsedParams } from "^/lib/useParsedParams";
import type { Zone } from "^/lib/wcl/zones";
import DropdownFilter from "../DropdownFilter";

export interface EncounterPickerProps {
    zones: Zone[];
}

export default function EncounterPicker({ zones }: EncounterPickerProps) {
    const { zone, encounter, setParams, buildUrl } = useParsedParams();

    if (zone == null) {
        return null;
    }
    const encounters = zones.find((z) => z.id === Number(zone))?.encounters;

    if (encounters == null) {
        throw new MalformedUrlParameterError(`Zone ${zone} has no encounters`);
    }

    return (
        <>
            <DropdownFilter
                tooltip="Encounter"
                options={encounters.map((e) => ({
                    label: e.name,
                    value: String(e.id),
                }))}
                selected={encounter ? String(encounter) : ""}
                key={encounter}
                setSelected={(encounter) =>
                    setParams({ encounter: Number(encounter) })
                }
            />
            <ul className="hidden">
                {encounters.map((e) => (
                    <li key={e.id}>
                        <Link
                            href={buildUrl(
                                { encounter: e.id },
                                { canonical: true },
                            )}
                        >
                            {e.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
}
