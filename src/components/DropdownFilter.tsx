"use client";

import { type ReactEventHandler, useState } from "react";

interface Option {
    label: string;
    value: string;
    disabled?: boolean;
}

export interface DropdownFilterProps {
    tooltip?: string;
    options: Option[];
    selected: string;
    setSelected: (selected: string) => void;
}

export default function DropdownFilter({
    tooltip,
    options,
    selected,
    setSelected,
}: DropdownFilterProps) {
    const [localState, setLocalState] = useState(selected);

    const onChange: ReactEventHandler<HTMLSelectElement> = (e) => {
        const val = e.target as HTMLSelectElement;
        const selected = val.value;

        setLocalState(selected);
        setSelected(selected);
    };

    return (
        <select onChange={onChange} value={localState} title={tooltip}>
            {options.map(({ value, label, disabled }) => (
                <option key={value} value={value} disabled={disabled}>
                    {label}
                </option>
            ))}
        </select>
    );
}
