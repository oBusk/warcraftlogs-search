"use client";

import { useEffect, useState } from "react";
import type { NullTalent } from "^/lib/nullGetTalents";
import { useParsedParams } from "^/lib/useParsedParams";
import { arrayEquals } from "^/lib/utils";
import Button from "../Button";
import TalentFilter, { type TalentFilterConfig } from "./TalentFilter";

export interface TalentPickerClientProps {
    talents: NullTalent[];
}

export default function TalentPickerClient({
    talents,
}: TalentPickerClientProps) {
    const { talents: paramFilters, setParams } = useParsedParams();
    const [filters, setFilters] = useState<TalentFilterConfig[]>(paramFilters);
    const [autofocus, setAutofocus] = useState(false);

    useEffect(() => {
        setTimeout(() => setAutofocus(true), 0);
    }, []);

    const updateUrl = (newTalents: TalentFilterConfig[]) => {
        setParams({
            talents: newTalents,
        });
    };

    return (
        <>
            {filters.map((filter, i) => (
                <TalentFilter
                    key={i}
                    talents={talents}
                    filter={filter}
                    filterChange={(e, apply) => {
                        const newTalents = [
                            ...paramFilters.slice(0, i),
                            ...(e == null ? [] : [e]),
                            ...paramFilters.slice(i + 1),
                        ];

                        setFilters(newTalents);
                        if (apply) {
                            updateUrl(newTalents);
                        }
                    }}
                    autoFocus={autofocus}
                />
            ))}
            <div className="flex flex-col gap-2">
                <Button
                    onClick={() =>
                        setFilters((curr) => [
                            ...curr,
                            {
                                name: "",
                                spellId: "",
                            },
                        ])
                    }
                >
                    {filters.length > 0 ? "Add" : "Find"} Talent
                </Button>
                {!arrayEquals(
                    paramFilters,
                    filters,
                    (a, b) => a.name === b.name && a.spellId === b.spellId,
                ) && <Button onClick={() => updateUrl(filters)}>Apply</Button>}
            </div>
        </>
    );
}
