"use client";

import { type ReactEventHandler, useState } from "react";
import { useNavigationTransition } from "^/lib/NavigationTransition";

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
    // While any filter navigation is in flight, lock every dropdown. This both
    // signals that the page is loading and avoids a race: a second change would
    // build its URL from the not-yet-committed search params and clobber the
    // first change.
    const { isPending } = useNavigationTransition();

    const onChange: ReactEventHandler<HTMLSelectElement> = (e) => {
        const val = e.target as HTMLSelectElement;
        const sel = val.value;

        setLocalState(sel);
        setSelected(sel);
    };

    return (
        <select
            onChange={onChange}
            value={localState}
            title={tooltip}
            disabled={isPending}
            aria-busy={isPending}
        >
            {options.map(({ value, label }) => (
                <option key={value} value={value}>
                    {label}
                </option>
            ))}
        </select>
    );
}
