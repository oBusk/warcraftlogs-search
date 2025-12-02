"use client";

import Link from "next/link";
import { useParsedParams } from "^/lib/useParsedParams";
import { type Zone } from "^/lib/wcl/zones";
import DropdownFilter from "../DropdownFilter";

export interface DifficultyPickerProps {
    zones: Zone[];
}

export default function DifficultyPicker({ zones }: DifficultyPickerProps) {
    const { zone, difficulty, setParams, buildUrl } = useParsedParams();

    if (zone == null) {
        return null;
    }

    const difficulties = zones.find((z) => z.id === Number(zone))?.difficulties;
    if (difficulties == null) {
        throw new Error(`Zone ${zone} has no difficulties`);
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
                        <Link href={buildUrl({ difficulty: d.id })}>
                            {d.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
}
