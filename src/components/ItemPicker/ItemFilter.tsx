import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export interface ItemFilterConfig {
    name: string;
    id: string;
    permanentEnchant: string;
    temporaryEnchant: string;
    bonusId: string;
    gemId: string;
}

export interface ItemFilterProps extends ComponentProps<"div"> {
    itemFilter: ItemFilterConfig;
    itemFilterChange: (
        filter: ItemFilterConfig | null,
        apply?: boolean,
    ) => void;
    autofocus?: boolean;
    disabled?: boolean;
}

export default function ItemFilter({
    itemFilter,
    itemFilterChange,
    autofocus,
    className,
    disabled,
    ...props
}: ItemFilterProps) {
    return (
        <div
            className={twMerge(
                "relative flex flex-col rounded-md border p-2",
                className,
            )}
            {...props}
        >
            <button
                type="button"
                className="absolute right-1 top-1 disabled:opacity-60"
                onClick={() => itemFilterChange(null, true)}
                disabled={disabled}
            >
                ✖
            </button>
            Name
            <input
                type="text"
                className="rounded-md border"
                disabled={disabled}
                autoFocus={autofocus}
                value={itemFilter.name}
                onChange={(e) =>
                    itemFilterChange(
                        {
                            ...itemFilter,
                            name: e.target.value,
                        },
                        false,
                    )
                }
            />
            Item ID
            <input
                type="text"
                className="rounded-md border"
                disabled={disabled}
                value={itemFilter.id}
                onChange={(e) =>
                    itemFilterChange(
                        {
                            ...itemFilter,
                            id: e.target.value,
                        },
                        false,
                    )
                }
            />
            Permanent Enchant
            <input
                type="text"
                className="rounded-md border"
                disabled={disabled}
                value={itemFilter.permanentEnchant}
                onChange={(e) =>
                    itemFilterChange(
                        {
                            ...itemFilter,
                            permanentEnchant: e.target.value,
                        },
                        false,
                    )
                }
            />
            Temporary Enchant
            <input
                type="text"
                className="rounded-md border"
                disabled={disabled}
                value={itemFilter.temporaryEnchant}
                onChange={(e) =>
                    itemFilterChange(
                        {
                            ...itemFilter,
                            temporaryEnchant: e.target.value,
                        },
                        false,
                    )
                }
            />
            Bonus ID
            <input
                type="text"
                className="rounded-md border"
                disabled={disabled}
                value={itemFilter.bonusId}
                onChange={(e) =>
                    itemFilterChange(
                        {
                            ...itemFilter,
                            bonusId: e.target.value,
                        },
                        false,
                    )
                }
            />
            Gem ID
            <input
                type="text"
                className="rounded-md border"
                disabled={disabled}
                value={itemFilter.gemId}
                onChange={(e) =>
                    itemFilterChange(
                        {
                            ...itemFilter,
                            gemId: e.target.value,
                        },
                        false,
                    )
                }
            />
        </div>
    );
}
