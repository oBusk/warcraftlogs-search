"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { FormEvent, KeyboardEventHandler } from "react";
import { createUrl } from "^/lib/utils";
import type { IndexTalent } from "^/lib/wow/talents";

export interface TalentPickerClientProps {
    talents: IndexTalent[];
}

export default function TalentPickerClient({
    talents,
}: TalentPickerClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const talentId = searchParams.get("talent");

    const updateUrl = (talent: string) => {
        const newParams = new URLSearchParams(searchParams.toString());

        if (talent) {
            newParams.set("talent", talent);
        } else {
            newParams.delete("talent");
        }

        router.push(createUrl(".", newParams));
    };

    const onChange = (e: FormEvent<HTMLInputElement>) => {
        const { value } = e.target as HTMLInputElement;

        if (talents.find((t) => t.id === parseInt(value))) {
            updateUrl(value);
        }
    };

    return (
        <div>
            Talent:&nbsp;
            <input
                type="text"
                list="talentList"
                onChange={onChange}
                value={talentId ?? ""}
            />
            <datalist id="talentList">
                {talents.map(({ id, name }) => (
                    <option key={id} value={id}>
                        {name}
                    </option>
                ))}
            </datalist>
        </div>
    );
}
