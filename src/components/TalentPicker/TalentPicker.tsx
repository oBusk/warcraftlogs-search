import { type ComponentProps } from "react";
import { nullGetTalents } from "^/lib/nullGetTalents";
import TalentPickerClient from "./TalentPicker.client";

export interface TalentPickerProps extends ComponentProps<"div"> {
    classId: number | null;
    specId: number | null;
}

export default async function TalentPicker({
    classId,
    specId,
    ...props
}: TalentPickerProps) {
    const talents =
        classId != null && specId != null
            ? await nullGetTalents(classId, specId)
            : [];

    return (
        <div {...props}>
            <TalentPickerClient
                talents={talents}
                key={`${classId}-${specId}`}
            />
        </div>
    );
}
