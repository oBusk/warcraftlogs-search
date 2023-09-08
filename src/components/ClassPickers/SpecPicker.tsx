"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ReactEventHandler } from "react";
import { PARAM_NAMES } from "^/lib/PARAM_NAMES";
import { createUrl } from "^/lib/utils";
import type { Klass } from "^/lib/wcl/classes";

export interface SpecPickerProps {
    classes: Klass[];
}

export default function SpecPicker({ classes }: SpecPickerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const klassId = searchParams.get(PARAM_NAMES.classId);

    if (klassId == null) {
        return null;
    }

    const specs = classes.find((c) => `${c.id}` === `${klassId}`)?.specs;

    if (specs == null) {
        throw new Error(`Class ${klassId} has no specs`);
    }

    const specId = searchParams.get(PARAM_NAMES.specId);

    const onChange: ReactEventHandler<HTMLSelectElement> = (e) => {
        const val = e.target as HTMLSelectElement;
        const spec = val.value;
        const newParams = new URLSearchParams(searchParams.toString());

        if (spec) {
            newParams.set(PARAM_NAMES.specId, spec);
        } else {
            newParams.delete(PARAM_NAMES.specId);
        }

        router.push(createUrl(".", newParams));
    };

    return (
        <select onChange={onChange} value={specId ?? ""}>
            <option value="">Any spec</option>
            {specs.map(({ id, name }) => (
                <option key={id} value={id}>
                    {name}
                </option>
            ))}
        </select>
    );
}
