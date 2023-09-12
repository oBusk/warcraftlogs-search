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
                { label: "Any Region", value: "", disabled: true },
                ...regions.map((r) => ({
                    label: r.name,
                    value: String(r.id),
                })),
            ]}
            selected={region ? String(region) : ""}
            setSelected={(region) => setParams({ region })}
        />
    );
}
