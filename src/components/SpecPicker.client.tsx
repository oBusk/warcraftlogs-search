"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ReactEventHandler } from "react";
import type { Klass, Spec } from "^/lib/classes";
import { createUrl } from "^/lib/utils";

export interface SpecPickerClientProps {
    classes: Klass[];
}

export default function SpecPickerClient({ classes }: SpecPickerClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const klassId = searchParams.get("class");

    if (klassId == null) {
        return null;
    }
    const specs = classes.find((c) => c.id === Number(klassId))?.specs;

    if (specs == null) {
        throw new Error(`Class ${klassId} has no specs`);
    }

    const specId = searchParams.get("spec");

    const onChange: ReactEventHandler<HTMLSelectElement> = (e) => {
        const val = e.target as HTMLSelectElement;
        const spec = val.value;
        const newParams = new URLSearchParams(searchParams.toString());

        if (spec) {
            newParams.set("spec", spec);
        } else {
            newParams.delete("spec");
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
