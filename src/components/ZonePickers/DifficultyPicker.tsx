"use client";

import Link from "next/link";
import { MalformedUrlParameterError } from "^/lib/Errors";
import { useParsedParams } from "^/lib/useParsedParams";
import { getDefaultZone } from "^/lib/wcl/currentTier";
import { type Zone } from "^/lib/wcl/zones";
import DropdownFilter from "../DropdownFilter";

export interface DifficultyPickerProps {
    zones: Zone[];
}

export default function DifficultyPicker({ zones }: DifficultyPickerProps) {
    const { zone, difficulty, setParams, buildUrl } = useParsedParams();

    const selectedZone = zone ?? getDefaultZone(zones)?.id;

    if (selectedZone == null) {
        return null;
    }

    const difficulties = zones.find(
        (z) => z.id === Number(selectedZone),
    )?.difficulties;
    if (difficulties == null) {
        throw new MalformedUrlParameterError(
            `Zone ${selectedZone} has no difficulties`,
        );
    }

    if (difficulties.length === 1) {
        return null;
    }

    return (
        <>
            <DropdownFilter
                tooltip="Difficulty"
                options={difficulties.map((d) => ({
                    label: d.name,
                    value: String(d.id),
                }))}
                selected={difficulty ? String(difficulty) : ""}
                key={difficulty}
                setSelected={(difficulty) =>
                    setParams({ difficulty: Number(difficulty) })
                }
            />
            <ul className="hidden">
                {difficulties.map((d) => (
                    <li key={d.id}>
                        <Link
                            href={buildUrl(
                                { difficulty: d.id },
                                { canonical: true },
                            )}
                        >
                            {d.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
}
