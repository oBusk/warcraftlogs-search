import { cacheLife } from "next/cache";
import { MalformedUrlParameterError } from "../Errors";
import { wclFetch } from "./wclFetch";

export interface Spec {
    name: string;
    id: number;
}

export interface WclClass {
    /** E.g. "Death Knight" */
    name: string;
    /** E.g. "DeathKnight" */
    slug: string;
    id: number;
    specs: Spec[];
}

export interface Klass extends WclClass {
    color: string;
}

const ClassFields = /* GraphQL */ `
    fragment ClassFields on GameClass {
        name
        slug
        id
        specs {
            name
            id
        }
    }
`;

export async function getClasses() {
    "use cache";

    cacheLife("expansion");

    const {
        gameData: { classes },
    } = await wclFetch<{
        gameData: {
            classes: WclClass[];
        };
    }>(/* GraphQL */ `
        query getClasses {
            gameData {
                classes {
                    ...ClassFields
                }
            }
        }
        ${ClassFields}
    `);

    return classes.map((wclClass) => ({
        ...wclClass,
        color: ClassColors[wclClass.slug],
    }));
}

export async function getClass(id: number) {
    const allClasses = await getClasses();

    const klass = allClasses.find((klass) => `${klass.id}` === `${id}`);

    if (!klass) {
        throw new MalformedUrlParameterError(`Class with id ${id} not found`);
    }

    return klass;
}

const ClassColors: Record<string, string> = {
    DeathKnight: "#C41E3A",
    DemonHunter: "#A330C9",
    Druid: "#FF7C0A",
    Evoker: "#33937F",
    Hunter: "#AAD372",
    Mage: "#3FC7EB",
    Monk: "#00FF98",
    Paladin: "#F48CBA",
    Priest: "#FFFFFF",
    Rogue: "#FFF468",
    Shaman: "#0070DD",
    Warlock: "#8788EE",
    Warrior: "#C69B6D",
};
