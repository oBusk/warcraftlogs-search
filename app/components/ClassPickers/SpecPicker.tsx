"use client";

import { useParsedParams } from "^/lib/useParsedParams";
import type { Klass } from "^/lib/wcl/classes";
import DropdownFilter from "../DropdownFilter";

export interface SpecPickerProps {
    classes: Klass[];
}

export default function SpecPicker({ classes }: SpecPickerProps) {
    const { classId, specId, setParams } = useParsedParams();

    if (classId == null) {
        return null;
    }

    const specs = classes.find((c) => `${c.id}` === `${classId}`)?.specs;

    if (specs == null) {
        throw new Error(`Class ${classId} has no specs`);
    }

    return (
        <DropdownFilter
            tooltip="Spec"
            options={[
                { label: "Any Spec", value: "" },
                ...specs.map((s) => ({
                    label: s.name,
                    value: String(s.id),
                })),
            ]}
            selected={specId ? String(specId) : ""}
            key={specId}
            setSelected={(specId) =>
                setParams({
                    specId: specId ? Number(specId) : null,
                })
            }
        />
    );
}
