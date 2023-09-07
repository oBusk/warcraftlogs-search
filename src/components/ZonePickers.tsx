import { ComponentProps } from "react";
import { getZones } from "^/lib/zones";
import EncounterPicker from "./EncounterPicker";
import PartitionPicker from "./PartitionPicker";
import ZonePicker from "./ZonePicker";

export default async function ZonePickers(props: ComponentProps<"div">) {
    const zones = await getZones();

    return (
        <div {...props}>
            <ZonePicker zones={zones} />
            <EncounterPicker zones={zones} />
            <PartitionPicker zones={zones} />
        </div>
    );
}
