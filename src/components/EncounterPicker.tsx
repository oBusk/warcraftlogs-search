import { getEncounters } from "^/lib/encounters";
import EncounterPickerClient from "./EncounterPicker.client";

export interface EncounterPickerProps {
    zone: number;
    encounter?: number;
}

export default async function EncounterPicker({
    zone,
    encounter,
}: EncounterPickerProps) {
    const encounters = await getEncounters(zone);

    return (
        <EncounterPickerClient encounters={encounters} encounter={encounter} />
    );
}
