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
            options={classes.map((c) => ({
                label: c.name,
                value: String(c.id),
            }))}
            selected={classId ? String(classId) : ""}
            setSelected={(classId) =>
                setParams({ classId: Number(classId), specId: null })
            }
        />
    );
}
