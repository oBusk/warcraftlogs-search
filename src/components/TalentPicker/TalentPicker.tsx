import { type ComponentProps } from "react";
import { nullGetTalents } from "^/lib/nullGetTalents";
import { parseParams, type RawParams } from "^/lib/Params";
import Button from "../Button";
import TalentPickerClient from "./TalentPicker.client";

export interface TalentPickerProps extends ComponentProps<"div"> {
    rawParams: Promise<RawParams> | RawParams;
}

export default async function TalentPicker({
    rawParams,
    ...props
}: TalentPickerProps) {
    const searchParams = await rawParams;

    const { classId, specId } = parseParams(searchParams);

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

TalentPicker.Fallback = function TalentPickerFallback(
    props: ComponentProps<"div">,
) {
    return (
        <div {...props}>
            <Button disabled>Find Talent</Button>
        </div>
    );
};
