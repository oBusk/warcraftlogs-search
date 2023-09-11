import {
    ReadonlyURLSearchParams,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { useCallback } from "react";
import { arrayEquals, createUrl } from "./utils";

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

type ParamType = ParamTypeString | ParamTypeNumber | ParamTypeNumberArray;

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
    talentSpellId: {
        name: "talentSpellId",
        type: "number",
        default: null,
    },
    pages: {
        name: "page",
        type: "numberarray",
        default: [1],
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
            ? params.get
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
            if (!Array.isArray(value)) {
                throw new Error(
                    `Expected ${key} to be an array, got ${typeof value}`,
                );
            }

            if (!arrayEquals(value, definition.default)) {
                searchParams.set(key, value.join(","));
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

        if (value === definition.default) {
            searchParams.delete(key);
        }
    }

    return searchParams;
}

export function useParsedParams() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const buildUrl = useCallback(
        (params: Partial<ParsedParams>) => {
            const newParams = toParams({
                ...parseParams(searchParams),
                ...params,
            });

            return createUrl(".", newParams);
        },
        [searchParams],
    );

    const setParams = useCallback(
        (params: Partial<ParsedParams>) => {
            router.replace(buildUrl(params));
        },
        [buildUrl, router],
    );

    return {
        ...parseParams(searchParams),
        buildUrl,
        setParams,
    };
}
