import { getTalents } from "^/lib/wow/talents";
import TalentPickerClient from "./TalentPicker.client";

export default async function TalentPicker() {
    const { talents } = await getTalents();

    return <TalentPickerClient talents={talents} />;
}
