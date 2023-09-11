"use client";

import { ReactEventHandler } from "react";
import { useParsedParams } from "^/lib/Params";
import { Region } from "^/lib/wcl/regions";

export interface RegionPickerProps {
    regions: Region[];
}

export default function RegionPicker({ regions }: RegionPickerProps) {
    const { region, setParams } = useParsedParams();

    const onChange: ReactEventHandler<HTMLSelectElement> = (e) => {
        const val = e.target as HTMLSelectElement;
        const region = val.value;

        setParams({
            region,
        });
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
