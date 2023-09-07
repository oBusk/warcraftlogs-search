import { getZones } from "^/lib/zones";
import EncounterPicker from "./EncounterPicker";
import PartitionPicker from "./PartitionPicker";

export default async function SubZonePicker() {
    const zones = await getZones();

    return (
        <>
            <EncounterPicker zones={zones} />
            <PartitionPicker zones={zones} />
        </>
    );
}
