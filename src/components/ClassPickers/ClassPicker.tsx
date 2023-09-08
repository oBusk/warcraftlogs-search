"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ReactEventHandler } from "react";
import { PARAM_NAMES } from "^/lib/PARAM_NAMES";
import { createUrl } from "^/lib/utils";
import { Klass } from "^/lib/wcl/classes";

export interface ClassPickerProps {
    classes: Klass[];
}

export default function ClassPicker({ classes }: ClassPickerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const klass = searchParams.get(PARAM_NAMES.classId);

    const onChange: ReactEventHandler<HTMLSelectElement> = (e) => {
        const val = e.target as HTMLSelectElement;
        const wowClass = val.value;
        const newParams = new URLSearchParams(searchParams.toString());

        if (wowClass) {
            newParams.set(PARAM_NAMES.classId, wowClass);
        } else {
            newParams.delete(PARAM_NAMES.classId);
        }
        newParams.delete(PARAM_NAMES.specId);

        router.push(createUrl(".", newParams));
    };

    return (
        <select onChange={onChange} value={klass ?? ""}>
            <option value="">Any class</option>
            {classes.map(({ id, slug, color }) => (
                <option key={id} value={id} style={{ color }}>
                    {slug}
                </option>
            ))}
        </select>
    );
}
