"use client";

import {
    type ComponentProps,
    type FormEventHandler,
    type KeyboardEventHandler,
    useState,
} from "react";

interface Option {
    label: string;
    value: string;
}

export interface ComboboxProps extends ComponentProps<"div"> {
    options: Option[];
    value: string;
    valueChanged: (talent: string) => void;
}

export default function Combobox({
    options,
    value,
    valueChanged,
    ...props
}: ComboboxProps) {
    const [localState, setLocalState] = useState(value);

    const OPTION_LIST = "OPTION_LIST";

    const onChange: FormEventHandler<HTMLInputElement> = (e) => {
        const { value } = e.target as HTMLInputElement;

        setLocalState(value);

        if (options.find((t) => t.value === value)) {
            valueChanged(value);
        }
    };

    const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === "Enter") {
            const { value } = e.target as HTMLInputElement;

            valueChanged(value);
        }
    };

    const clear = () => {
        setLocalState("");
        valueChanged("");
    };

    return (
        <div {...props}>
            <input
                type="text"
                list={OPTION_LIST}
                onChange={onChange}
                onKeyDown={onKeyDown}
                value={localState}
            />
            <datalist id={OPTION_LIST}>
                {options.map(({ label, value }) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </datalist>
            <button
                title="Clear"
                type="button"
                onClick={clear}
                disabled={localState.length < 1}
                className="disabled:opacity-25"
            >
                ✖
            </button>
        </div>
    );
}
