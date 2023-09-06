"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ReactEventHandler } from "react";
import type { Spec } from "^/lib/classes";
import { createUrl } from "^/lib/utils";

export interface SpecPickerClientProps {
    specs: Spec[];
    specId?: number;
}

export default function SpecPickerClient({
    specs,
    specId,
}: SpecPickerClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

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
