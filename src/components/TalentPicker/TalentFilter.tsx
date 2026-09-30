"use client";

import { useCombobox, type UseComboboxStateChange } from "downshift";
import { type ComponentProps, useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";
import { type NullTalent } from "^/lib/nullGetTalents";

export interface TalentFilterConfig {
    name?: string;
    talentId?: string;
}

export interface TalentFilterProps extends ComponentProps<"div"> {
    talents: NullTalent[];
    filter: TalentFilterConfig;
    filterChange: (filter: TalentFilterConfig | null, apply?: boolean) => void;
    autofocus?: boolean;
}

export default function TalentFilter({
    filter,
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
                        talentId: filter.talentId,
                    });
                }
                setItems(filterItems(inputValue));
            },
            [filter.talentId, filterChange, filterItems],
        ),
        onSelectedItemChange: useCallback(
            ({ selectedItem }: UseComboboxStateChange<NullTalent>) => {
                if (selectedItem) {
                    filterChange(
                        {
                            name: selectedItem.name,
                            talentId: `${selectedItem.talentId}`,
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
                "relative flex flex-col rounded-md border border-gray-200 p-2",
                className,
            )}
            {...props}
        >
            <button
                type="button"
                className="absolute top-1 right-1 enabled:cursor-pointer"
                onClick={() => filterChange(null, true)}
            >
                ✖
            </button>
            Talent Name 🔎{" "}
            <input type="text" list="talentlist" {...getInputProps()} />
            <div className="relative">
                <ul
                    className={twMerge(
                        "absolute rounded-md border border-gray-200 bg-black py-1",
                        (!isOpen || items.length < 1) && "hidden",
                    )}
                    {...getMenuProps()}
                >
                    {isOpen
                        ? items.map((item, index) => (
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
                          ))
                        : null}
                </ul>
            </div>
            Talent ID{" "}
            <input
                type="text"
                value={filter.talentId}
                onChange={(e) =>
                    filterChange({
                        name: filter.name,
                        talentId: e.target.value,
                    })
                }
            />
        </div>
    );
}
