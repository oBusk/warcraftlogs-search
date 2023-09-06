"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ReactEventHandler } from "react";
import { createUrl } from "^/lib/utils";

export interface ClassPickerClientProps {
    classes: string[];
    currentClass?: string;
}

export default function ClassPickerClient({
    classes,
    currentClass,
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

        router.push(createUrl(".", newParams));
    };

    return (
        <select onChange={onChange} value={currentClass ?? ""}>
            <option value="">Select a class</option>
            {classes.map((wowClass) => (
                <option key={wowClass} value={wowClass}>
                    {wowClass}
                </option>
            ))}
        </select>
    );
}
