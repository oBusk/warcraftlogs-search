import { ComponentProps } from "react";
import { getRegions } from "^/lib/wcl/regions";
import { getZones } from "^/lib/wcl/zones";
import EncounterPicker from "./EncounterPicker";
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
            <PartitionPicker zones={zones} />
        </div>
    );
}
