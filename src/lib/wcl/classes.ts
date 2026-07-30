import { MalformedUrlParameterError } from "../Errors";
import { getGameData } from "./gameData";

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

export async function getClasses() {
    return (await getGameData()).classes;
}

export async function getClass(id: number) {
    const allClasses = await getClasses();

    const klass = allClasses.find((klass) => `${klass.id}` === `${id}`);

    if (!klass) {
        throw new MalformedUrlParameterError(`Class with id ${id} not found`);
    }

    return klass;
}
