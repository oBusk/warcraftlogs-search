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
