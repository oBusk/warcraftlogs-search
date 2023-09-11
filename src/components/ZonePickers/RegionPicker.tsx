"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ReactEventHandler } from "react";
import { PARAM_NAMES } from "^/lib/PARAM_NAMES";
import { createUrl } from "^/lib/utils";
import { Region } from "^/lib/wcl/regions";

export interface RegionPickerProps {
    regions: Region[];
}

export default function RegionPicker({ regions }: RegionPickerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const region = searchParams.get(PARAM_NAMES.region);

    const onChange: ReactEventHandler<HTMLSelectElement> = (e) => {
        const val = e.target as HTMLSelectElement;
        const region = val.value;
        const newParams = new URLSearchParams(searchParams.toString());

        if (region) {
            newParams.set(PARAM_NAMES.region, region);
        } else {
            newParams.delete(PARAM_NAMES.region);
        }

        router.push(createUrl(".", newParams));
    };

    return (
        <select onChange={onChange} value={region ?? ""}>
            <option value="">Any region</option>
            {regions.map((region) => (
                <option key={region.id} value={region.slug}>
                    {region.name}
                </option>
            ))}
        </select>
    );
}
