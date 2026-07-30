import type NameId from "../NameId";
import { getGameData } from "./gameData";

export interface Region extends Omit<NameId, "id"> {
    /** E.g. `US`, `EU` */
    slug: string;
}

export async function getRegions() {
    return (await getGameData()).regions;
}
