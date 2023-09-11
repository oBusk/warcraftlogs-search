"use client";

import { ReactEventHandler } from "react";
import { useParsedParams } from "^/lib/Params";
import { Klass } from "^/lib/wcl/classes";

export interface ClassPickerProps {
    classes: Klass[];
}

export default function ClassPicker({ classes }: ClassPickerProps) {
    const { classId, setParams } = useParsedParams();

    const onChange: ReactEventHandler<HTMLSelectElement> = (e) => {
        const val = e.target as HTMLSelectElement;
        const wowClass = val.value;

        setParams({
            classId: Number(wowClass),
        });
    };

    return (
        <select onChange={onChange} value={classId ?? ""}>
            <option value="">Any class</option>
            {classes.map(({ id, slug, color }) => (
                <option key={id} value={id} style={{ color }}>
                    {slug}
                </option>
            ))}
        </select>
    );
}
