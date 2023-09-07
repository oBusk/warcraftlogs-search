"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { KeyboardEventHandler } from "react";
import { createUrl } from "^/lib/utils";

export interface TalentPickerProps {
    talent?: number;
}

export default function TalentPicker({ talent }: TalentPickerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        // Only continue if it was the enter key
        if (e.key !== "Enter") {
            return;
        }
        const val = e.target as HTMLInputElement;
        const talent = val.value;
        const newParams = new URLSearchParams(searchParams.toString());

        if (talent) {
            newParams.set("talent", talent);
        } else {
            newParams.delete("talent");
        }

        router.push(createUrl(".", newParams));
    };

    return (
        <div>
            Enter talentID:&nbsp;
            <input
                type="text"
                onKeyDown={onKeyDown}
                defaultValue={talent ?? ""}
            />
        </div>
    );
}
