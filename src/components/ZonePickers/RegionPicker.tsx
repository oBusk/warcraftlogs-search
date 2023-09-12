"use client";

import { useParsedParams } from "^/lib/Params";
import { Region } from "^/lib/wcl/regions";
import DropdownFilter from "../DropdownFilter";

export interface RegionPickerProps {
    regions: Region[];
}

export default function RegionPicker({ regions }: RegionPickerProps) {
    const { region, setParams } = useParsedParams();

    return (
        <DropdownFilter
            tooltip="Region"
            options={[
                { label: "Any Region", value: "" },
                ...regions.map((r) => ({
                    label: r.name,
                    value: r.slug,
                })),
            ]}
            selected={region ? String(region) : ""}
            key={region}
            setSelected={(region) => setParams({ region: region || null })}
        />
    );
}
