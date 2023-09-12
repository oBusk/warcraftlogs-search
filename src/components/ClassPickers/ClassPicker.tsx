"use client";

import { useParsedParams } from "^/lib/Params";
import { Klass } from "^/lib/wcl/classes";
import DropdownFilter from "../DropdownFilter";

export interface ClassPickerProps {
    classes: Klass[];
}

export default function ClassPicker({ classes }: ClassPickerProps) {
    const { classId, setParams } = useParsedParams();

    return (
        <DropdownFilter
            tooltip="Class"
            options={[
                { label: "Any Class", value: "" },
                ...classes.map((c) => ({
                    label: c.name,
                    value: String(c.id),
                })),
            ]}
            selected={classId ? String(classId) : ""}
            key={classId}
            setSelected={(classId) =>
                setParams({
                    classId: classId ? Number(classId) : null,
                    specId: null,
                })
            }
        />
    );
}
