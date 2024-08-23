import { ReadonlyURLSearchParams } from "next/navigation";
import { type ItemFilterConfig } from "^/components/ItemPicker/ItemFilter";
import { type TalentFilterConfig } from "^/components/TalentPicker/TalentFilter";
import { arrayEquals } from "./utils";

interface ParamTypeString {
    name: string;
    type: "string";
    default: string | null;
}

interface ParamTypeNumber {
    name: string;
    type: "number";
    default: number | null;
}

interface ParamTypeNumberArray {
    name: string;
    type: "numberarray";
    default: readonly number[] | null;
}

interface ParamTypeTalentFilter {
    name: string;
    type: "talentFilter";
    default: TalentFilterConfig[] | null;
}

interface ParamTypeItemFilters {
    name: string;
    type: "itemFilters";
    default: TalentFilterConfig[] | null;
}

function isParamTypeString(paramType: ParamType): paramType is ParamTypeString {
    return paramType.type === "string";
}

function isParamTypeNumber(paramType: ParamType): paramType is ParamTypeNumber {
    return paramType.type === "number";
}

function isParamTypeNumberArray(
    paramType: ParamType,
): paramType is ParamTypeNumberArray {
    return paramType.type === "numberarray";
}

function isParamTypeTalentFilter(
    paramType: ParamType,
): paramType is ParamTypeTalentFilter {
    return paramType.type === "talentFilter";
}

function isParamTypeItemsFilter(
    paramType: ParamType,
): paramType is ParamTypeItemFilters {
    return paramType.type === "itemFilters";
}

function isNumberArray(a: any): a is number[] {
    return Array.isArray(a) && a.every((x) => typeof x === "number");
}

type ParamType =
    | ParamTypeString
    | ParamTypeNumber
    | ParamTypeNumberArray
    | ParamTypeTalentFilter
    | ParamTypeItemFilters;

const paramTypes = Object.freeze({
    region: {
        name: "region",
        type: "string",
        default: null,
    },
    zone: {
        name: "zone",
        type: "number",
        default: 33, // Aberrus, the Shadowed Crucible
    },
    encounter: {
        name: "encounter",
        type: "number",
        default: 2688, // Kazzara, the Hellforged
    },
    difficulty: {
        name: "difficulty",
        type: "number",
        default: 5, // Mythic
    },
    partition: {
        name: "partition",
        type: "number",
        default: null, // Let the API decide
    },
    metric: {
        name: "metric",
        type: "string",
        default: "dps",
    },
    classId: {
        name: "class",
        type: "number",
        default: null,
    },
    specId: {
        name: "spec",
        type: "number",
        default: null,
    },
    pages: {
        name: "page",
        type: "numberarray",
        default: [1],
    },
    talents: {
        name: "talents",
        type: "talentFilter",
        default: new Array<TalentFilterConfig>(),
    },
    itemFilters: {
        name: "items",
        type: "itemFilters",
        default: new Array<ItemFilterConfig>(),
    },
} as const satisfies Record<string, ParamType>);

type ParamTypes = typeof paramTypes;
type ParamKey = keyof ParamTypes;
type ParamTypeType<T extends ParamKey> = ParamTypes[T]["type"];
type ParamTypeDefault<T extends ParamKey> = ParamTypes[T]["default"];
export type ParamName = ParamTypes[ParamKey]["name"];
export type RawParams = Record<ParamName, string>;
// Extract type for each property from the above
export type ParsedParams = {
    [K in ParamKey]:
        | (ParamTypeType<K> extends "number"
              ? number
              : ParamTypeType<K> extends "numberarray"
                ? number[]
                : ParamTypeType<K> extends "talentFilter"
                  ? TalentFilterConfig[]
                  : ParamTypeType<K> extends "itemFilters"
                    ? ItemFilterConfig[]
                    : string)
        | ParamTypeDefault<K>;
};

export function parseParams(
    params:
        | URLSearchParams
        | ReadonlyURLSearchParams
        | { [key: string]: string },
): ParsedParams {
    const getParam =
        params instanceof URLSearchParams ||
        params instanceof ReadonlyURLSearchParams
            ? params.get.bind(params)
            : (key: keyof ParamTypes) => params[key];

    const parsedParams = {} as Record<string, any>;

    for (const [key, { type, default: defaultValue }] of Object.entries(
        paramTypes,
    )) {
        const value = getParam(key);

        if (value == null) {
            parsedParams[key] = defaultValue;
        } else if (type === "number") {
            parsedParams[key as ParamName] = Number(value);
        } else if (type === "numberarray") {
            parsedParams[key as ParamName] = value.split(",").map(Number);
        } else if (type === "talentFilter" || type === "itemFilters") {
            parsedParams[key as ParamName] = JSON.parse(value);
        } else {
            parsedParams[key as ParamName] = value;
        }
    }

    return parsedParams as ParsedParams;
}

/** Utility that takes an object in the format we use for data, if it matches default, we also delete the property */
export function toParams(params: ParsedParams): URLSearchParams {
    const searchParams = new URLSearchParams();

    for (const [key, definition] of Object.entries(paramTypes)) {
        const value = params[key as ParamKey];

        if (value == null) {
            continue;
        }

        if (isParamTypeNumber(definition)) {
            if (typeof value !== "number") {
                throw new Error(
                    `Expected ${key} to be a number, got ${typeof value}`,
                );
            }

            if (value !== definition.default) {
                searchParams.set(key, `${value}`);
            }
        }

        if (isParamTypeNumberArray(definition)) {
            if (!isNumberArray(value)) {
                throw new Error(
                    `Expected ${key} to be an array, got ${typeof value}`,
                );
            }

            if (!arrayEquals(value, definition.default)) {
                searchParams.set(key, value.join(","));
            }
        }

        if (isParamTypeTalentFilter(definition)) {
            if (typeof value !== "object") {
                throw new Error(
                    `Expected ${key} to be an object, got ${typeof value}`,
                );
            }

            if (JSON.stringify(value) !== JSON.stringify(definition.default)) {
                searchParams.set(key, JSON.stringify(value));
            }
        }

        if (isParamTypeString(definition)) {
            if (typeof value !== "string") {
                throw new Error(
                    `Expected ${key} to be a string, got ${typeof value}`,
                );
            }

            if (value !== definition.default) {
                searchParams.set(key, value);
            }
        }

        if (isParamTypeItemsFilter(definition)) {
            if (typeof value !== "object") {
                throw new Error(
                    `Expected ${key} to be an object, got ${typeof value}`,
                );
            }

            if (JSON.stringify(value) !== JSON.stringify(definition.default)) {
                searchParams.set(key, JSON.stringify(value));
            }
        }

        if (value === definition.default) {
            searchParams.delete(key);
        }
    }

    return searchParams;
}
