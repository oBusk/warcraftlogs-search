"use client";

import { FormEventHandler, KeyboardEventHandler } from "react";
import type { NullTalent } from "^/lib/nullGetTalents";
import { useParsedParams } from "^/lib/Params";
import Combobox from "./Combobox";

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

    return (
        <Combobox
            options={talents.map((t) => ({
                label: t.name,
                value: String(t.spellid),
            }))}
            value={talentSpellId ? String(talentSpellId) : ""}
            valueChanged={(talent) =>
                updateUrl(talent.trim() === "" ? null : Number(talent))
            }
        />
    );
}
