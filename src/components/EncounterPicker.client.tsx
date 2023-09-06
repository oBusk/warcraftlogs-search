"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ReactEventHandler } from "react";
import { Encounter } from "^/lib/encounters";
import { createUrl } from "^/lib/utils";

export interface EncounterPickerClientProps {
    encounters: Encounter[];
    encounter?: number;
}

export default function EncounterPickerClient({
    encounters,
    encounter,
}: EncounterPickerClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const onChange: ReactEventHandler<HTMLSelectElement> = (e) => {
        const val = e.target as HTMLSelectElement;
        const encounter = val.value;
        const newParams = new URLSearchParams(searchParams.toString());

        if (encounter) {
            newParams.set("encounter", encounter);
        } else {
            newParams.delete("encounter");
        }

        router.push(createUrl(".", newParams));
    };

    return (
        <select onChange={onChange} value={encounter ?? ""}>
            <option value="">Select an encounter</option>
            {encounters.map((encounter) => (
                <option key={encounter.id} value={encounter.id}>
                    {encounter.name}
                </option>
            ))}
        </select>
    );
}
