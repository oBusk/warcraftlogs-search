"use client";

import { type ComponentProps, useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useParsedParams } from "^/lib/Params";
import { arrayEquals } from "^/lib/utils";
import Button from "../Button";
import ItemFilter, { type ItemFilterConfig } from "./ItemFilter";

export interface ItemPickerProps extends ComponentProps<"div"> {
    itemFilters: ItemFilterConfig[];
}

export default function ItemPicker({
    itemFilters,
    className,
    ...props
}: ItemPickerProps) {
    const { setParams } = useParsedParams();
    const [localFilters, setLocalFilters] =
        useState<ItemFilterConfig[]>(itemFilters);
    const [autofocus, setAutofocus] = useState(false);

    useEffect(() => {
        setTimeout(() => setAutofocus(true), 0);
    }, []);

    const updateUrl = useCallback(
        (newFilters: ItemFilterConfig[]) => {
            setParams({
                itemFilters: newFilters,
            });
        },
        [setParams],
    );

    const onClick = useCallback(
        () =>
            setLocalFilters((curr) => [
                ...curr,
                {
                    name: "",
                    id: "",
                    permanentEnchant: "",
                    temporaryEnchant: "",
                    bonusId: "",
                    gemId: "",
                },
            ]),
        [setLocalFilters],
    );

    return (
        <div className={twMerge(className)} {...props}>
            {localFilters.map((itemFilter, i) => (
                <ItemFilter
                    key={`${itemFilter.name}`}
                    itemFilter={itemFilter}
                    itemFilterChange={(e, apply) => {
                        const newFilters = [
                            ...itemFilters.slice(0, i),
                            ...(e == null ? [] : [e]),
                            ...itemFilters.slice(i + 1),
                        ];

                        setLocalFilters(newFilters);
                        if (apply) {
                            updateUrl(newFilters);
                        }
                    }}
                    autoFocus={autofocus}
                />
            ))}
            <div className="flex flex-col gap-2">
                <Button onClick={onClick}>Find Item</Button>
                {!arrayEquals(
                    itemFilters,
                    localFilters,
                    (a, b) =>
                        a.name === b.name &&
                        a.id === b.id &&
                        a.permanentEnchant === b.permanentEnchant &&
                        a.temporaryEnchant === b.temporaryEnchant &&
                        a.bonusId === b.bonusId &&
                        a.gemId === b.gemId,
                ) && (
                    <Button onClick={() => updateUrl(localFilters)}>
                        Apply
                    </Button>
                )}
            </div>
        </div>
    );
}
