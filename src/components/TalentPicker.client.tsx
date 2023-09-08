"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
    type FormEvent,
    FormEventHandler,
    KeyboardEvent,
    KeyboardEventHandler,
} from "react";
import type { NullTalent } from "^/lib/nullGetTalents";
import { PARAM_NAMES } from "^/lib/PARAM_NAMES";
import { createUrl } from "^/lib/utils";

export interface TalentPickerClientProps {
    talents: NullTalent[];
}

export default function TalentPickerClient({
    talents,
}: TalentPickerClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const talentSpellId = searchParams.get(PARAM_NAMES.talentSpellId);

    const updateUrl = (talent: string | undefined) => {
        const newParams = new URLSearchParams(searchParams.toString());

        if (talent) {
            newParams.set(PARAM_NAMES.talentSpellId, talent);
        } else {
            newParams.delete(PARAM_NAMES.talentSpellId);
        }

        router.push(createUrl(".", newParams));
    };

    const onChange: FormEventHandler<HTMLInputElement> = (e) => {
        const { value } = e.target as HTMLInputElement;

        if (talents.find((t) => t.spellid === parseInt(value))) {
            updateUrl(value);
        }
    };

    const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === "Enter") {
            const { value } = e.target as HTMLInputElement;

            updateUrl(value);
        }
    };

    const clear = () => {
        updateUrl(undefined);
    };

    return (
        <div>
            Talent:&nbsp;
            <input
                type="text"
                list="talentList"
                onChange={onChange}
                onKeyDown={onKeyDown}
                defaultValue={talentSpellId ?? ""}
            />
            <datalist id="talentList">
                {talents.map(({ spellid, name }) => (
                    <option key={spellid} value={spellid}>
                        {name}
                    </option>
                ))}
            </datalist>
            <button type="button" onClick={clear}>
                ✖
            </button>
        </div>
    );
}
