"use client";

import { useParsedParams } from "^/lib/Params";
import { Zone } from "^/lib/wcl/zones";

export interface DifficultyPickerProps {
    zones: Zone[];
}

export default function DifficultyPicker({ zones }: DifficultyPickerProps) {
    const { zone, difficulty, setParams } = useParsedParams();

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

    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target as HTMLSelectElement;
        const difficulty = val.value;

        setParams({
            difficulty: Number(difficulty),
        });
    };

    return (
        <select onChange={onChange} value={difficulty ?? difficulties[0].id}>
            {difficulties.map((difficulty) => (
                <option key={difficulty.id} value={difficulty.id}>
                    {difficulty.name}
                </option>
            ))}
        </select>
    );
}
