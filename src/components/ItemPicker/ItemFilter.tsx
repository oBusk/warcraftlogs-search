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
}

export default function ItemFilter({
    itemFilter,
    itemFilterChange,
    autofocus,
    className,
    ...props
}: ItemFilterProps) {
    return (
        <div
            className={twMerge(
                "border rounded-md flex flex-col p-2 relative",
                className,
            )}
            {...props}
        >
            <button
                type="button"
                className="absolute right-1 top-1"
                onClick={() => itemFilterChange(null, true)}
            >
                ✖
            </button>
            Name
            <input
                type="text"
                className="border rounded-md"
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
                className="border rounded-md"
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
                className="border rounded-md"
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
                className="border rounded-md"
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
                className="border rounded-md"
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
                className="border rounded-md"
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
