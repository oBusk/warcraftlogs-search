import { getClass } from "^/lib/classes";
import SpecPickerClient from "./SpecPicker.client";

export interface SpecPickerProps {
    klassId: number;
    specId?: number;
}

export default async function SpecPicker({ klassId, specId }: SpecPickerProps) {
    const { specs } = await getClass(klassId);

    return <SpecPickerClient specs={specs} specId={specId} />;
}
