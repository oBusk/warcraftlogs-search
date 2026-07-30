import type NameId from "../NameId";

export interface Region extends Omit<NameId, "id"> {
    /** E.g. `US`, `EU` */
    slug: string;
}
