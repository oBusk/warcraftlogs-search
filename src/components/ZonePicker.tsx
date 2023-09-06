import { getZones } from "^/lib/zones";
import ZonePickerClient from "./ZonePicker.client";

export interface ZonePickerProps {
    zone?: number;
}

export default async function ZonePicker({ zone }: ZonePickerProps) {
    const zones = await getZones();

    return <ZonePickerClient zones={zones} zone={zone} />;
}
