import { nullGetTalents } from "^/lib/nullGetTalents";
import TalentPickerClient from "./TalentPicker.client";

export interface TalentPickerProps {
    classId: number | null;
    specId: number | null;
}

export default async function TalentPicker({
    classId,
    specId,
}: TalentPickerProps) {
    const talents =
        classId != null && specId != null
            ? await nullGetTalents(classId, specId)
            : [];

    return <TalentPickerClient talents={talents} />;
}
