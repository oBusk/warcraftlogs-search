"use client";

import { ReactEventHandler } from "react";
import { useParsedParams } from "^/lib/Params";
import type { Klass } from "^/lib/wcl/classes";

export interface SpecPickerProps {
    classes: Klass[];
}

export default function SpecPicker({ classes }: SpecPickerProps) {
    const { classId, specId, setParams } = useParsedParams();

    if (classId == null) {
        return null;
    }

    const specs = classes.find((c) => `${c.id}` === `${classId}`)?.specs;

    if (specs == null) {
        throw new Error(`Class ${classId} has no specs`);
    }

    const onChange: ReactEventHandler<HTMLSelectElement> = (e) => {
        const val = e.target as HTMLSelectElement;
        const spec = val.value;

        setParams({
            specId: Number(spec),
        });
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
