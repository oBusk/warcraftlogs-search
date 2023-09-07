"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ReactEventHandler } from "react";
import { Klass } from "^/lib/classes";
import { createUrl } from "^/lib/utils";

export interface ClassPickerClientProps {
    classes: Klass[];
    klass?: number;
}

export default function ClassPickerClient({
    classes,
    klass,
}: ClassPickerClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const onChange: ReactEventHandler<HTMLSelectElement> = (e) => {
        const val = e.target as HTMLSelectElement;
        const wowClass = val.value;
        const newParams = new URLSearchParams(searchParams.toString());

        if (wowClass) {
            newParams.set("class", wowClass);
        } else {
            newParams.delete("class");
        }
        newParams.delete("spec");

        router.push(createUrl(".", newParams));
    };

    return (
        <select onChange={onChange} value={klass ?? ""}>
            <option value="">Any class</option>
            {classes.map(({ id, name }) => (
                <option key={id} value={id}>
                    {name}
                </option>
            ))}
        </select>
    );
}
