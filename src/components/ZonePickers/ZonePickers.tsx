import { ComponentProps } from "react";
import { getRegions } from "^/lib/wcl/regions";
import { getZones } from "^/lib/wcl/zones";
import DifficultyPicker from "./DifficultyPicker";
import EncounterPicker from "./EncounterPicker";
import MetricPicker from "./MetricPicker";
import PartitionPicker from "./PartitionPicker";
import RegionPicker from "./RegionPicker";
import ZonePicker from "./ZonePicker";

export default async function ZonePickers(props: ComponentProps<"div">) {
    const [regions, zones] = await Promise.all([getRegions(), getZones()]);

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
