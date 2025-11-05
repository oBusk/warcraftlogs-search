import { type ComponentProps } from "react";
import type { Region } from "^/lib/wcl/regions";
import type { Zone } from "^/lib/wcl/zones";
import DifficultyPicker from "./DifficultyPicker";
import EncounterPicker from "./EncounterPicker";
import MetricPicker from "./MetricPicker";
import PartitionPicker from "./PartitionPicker";
import RegionPicker from "./RegionPicker";
import ZonePicker from "./ZonePicker";

export interface ZonePickersProps extends ComponentProps<"div"> {
    regions: Region[];
    zones: Zone[];
}

export default function ZonePickers({ regions, zones, ...props }: ZonePickersProps) {
    return (
        <div {...props}>
            <RegionPicker regions={regions} />
            <ZonePicker zones={zones} />
            <EncounterPicker zones={zones} />
            <DifficultyPicker zones={zones} />
            <PartitionPicker zones={zones} />
            <MetricPicker />
        </div>
    );
}
