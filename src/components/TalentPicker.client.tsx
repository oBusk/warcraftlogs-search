"use client";

import { FormEventHandler, KeyboardEventHandler } from "react";
import type { NullTalent } from "^/lib/nullGetTalents";
import { useParsedParams } from "^/lib/Params";

export interface TalentPickerClientProps {
    talents: NullTalent[];
}

export default function TalentPickerClient({
    talents,
}: TalentPickerClientProps) {
    const { talentSpellId, setParams } = useParsedParams();

    const updateUrl = (talent: number | null) => {
        setParams({
            talentSpellId: talent,
        });
    };

    const onChange: FormEventHandler<HTMLInputElement> = (e) => {
        const { value } = e.target as HTMLInputElement;

        if (talents.find((t) => t.spellid === parseInt(value))) {
            updateUrl(Number(value));
        }
    };

    const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === "Enter") {
            const { value } = e.target as HTMLInputElement;

            updateUrl(Number(value));
        }
    };

    const clear = () => {
        updateUrl(null);
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
