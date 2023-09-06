"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ReactEventHandler } from "react";
import { createUrl } from "^/lib/utils";
import type { Zone } from "^/lib/zones";

export interface ZonePickerClientProps {
    zones: Zone[];
    zone?: number;
}

export default function ZonePickerClient({
    zones,
    zone,
}: ZonePickerClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const onChange: ReactEventHandler<HTMLSelectElement> = (e) => {
        const val = e.target as HTMLSelectElement;
        const zone = val.value;
        const newParams = new URLSearchParams(searchParams.toString());

        if (zone) {
            newParams.set("zone", zone);
        } else {
            newParams.delete("zone");
        }

        router.push(createUrl(".", newParams));
    };

    return (
        <select onChange={onChange} value={zone ?? ""}>
            <option value="">Select a zone</option>
            {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                    {zone.name}
                </option>
            ))}
        </select>
    );
}
