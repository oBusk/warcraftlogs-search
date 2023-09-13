"use client";

import { useCombobox, type UseComboboxStateChange } from "downshift";
import { type ComponentProps, useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";
import { type NullTalent } from "^/lib/nullGetTalents";

export interface TalentFilterConfig {
    name?: string;
    spellId?: string;
}

export interface TalentFilterProps extends ComponentProps<"div"> {
    talents: NullTalent[];
    filter: TalentFilterConfig;
    filterChange: (filter: TalentFilterConfig | null, apply?: boolean) => void;
    autofocus?: boolean;
}

export default function TalentFilter({
    filter = {
        name: "",
        spellId: "",
    },
    filterChange,
    talents,
    className,
    autoFocus,
    ...props
}: TalentFilterProps) {
    const filterItems = useCallback(
        (filter?: string) => {
            if (!filter) {
                return talents.slice(0, 10);
            }

            const searchString = filter.toLowerCase();
            const result = [];

            for (const talent of talents) {
                if (talent.name.toLowerCase().includes(searchString)) {
                    result.push(talent);

                    if (result.length >= 10) {
                        break;
                    }
                }
            }

            return result;
        },
        [talents],
    );

    const [items, setItems] = useState(filterItems(filter.name));

    const {
        isOpen,
        getInputProps,
        getMenuProps,
        getItemProps,
        highlightedIndex,
        selectedItem,
    } = useCombobox({
        defaultInputValue: filter.name,
        initialIsOpen: autoFocus,
        items,
        itemToString: useCallback(
            (item: NullTalent | null) => item?.name ?? "",
            [],
        ),
        onInputValueChange: useCallback(
            ({ inputValue, type }: UseComboboxStateChange<NullTalent>) => {
                if (type === useCombobox.stateChangeTypes.InputChange) {
                    filterChange({
                        name: inputValue,
                        spellId: filter.spellId,
                    });
                }
                setItems(filterItems(inputValue));
            },
            [filter.spellId, filterChange, filterItems],
        ),
        onSelectedItemChange: useCallback(
            ({ selectedItem }: UseComboboxStateChange<NullTalent>) => {
                if (selectedItem) {
                    filterChange(
                        {
                            name: selectedItem.name,
                            spellId: `${selectedItem.spellId}`,
                        },
                        true,
                    );
                }
            },
            [filterChange],
        ),
    });

    return (
        <div
            className={twMerge(
                "rounded-md border flex flex-col p-2 relative",
                className,
            )}
            {...props}
        >
            <button
                type="button"
                className="absolute right-1 top-1"
                onClick={() => filterChange(null, true)}
            >
                ✖
            </button>
            Talent Name 🔎{" "}
            <input type="text" list="talentlist" {...getInputProps()} />
            <div className="relative">
                <ul
                    className={twMerge(
                        "absolute bg border rounded-md py-1",
                        (!isOpen || items.length < 1) && "hidden",
                    )}
                    {...getMenuProps()}
                >
                    {isOpen &&
                        items.map((item, index) => (
                            <li
                                className={twMerge(
                                    "px-2",
                                    highlightedIndex === index &&
                                        "bg-slate-800",
                                    selectedItem === item && "font-bold",
                                )}
                                key={`${item.name}${index}`}
                                {...getItemProps({ item, index })}
                            >
                                {item.name}
                            </li>
                        ))}
                </ul>
            </div>
            SpellId{" "}
            <input
                type="text"
                value={filter.spellId}
                onChange={(e) =>
                    filterChange({
                        name: filter.name,
                        spellId: e.target.value,
                    })
                }
            />
        </div>
    );
}
