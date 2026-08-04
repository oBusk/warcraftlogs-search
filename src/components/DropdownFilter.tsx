"use client";

import { type ReactEventHandler, useState } from "react";

interface Option {
    label: string;
    value: string;
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
        const sel = val.value;

        setLocalState(sel);
        setSelected(sel);
    };

    return (
        <select onChange={onChange} value={localState} title={tooltip}>
            {options.map(({ value, label }) => (
                <option key={value} value={value}>
                    {label}
                </option>
            ))}
        </select>
    );
}
