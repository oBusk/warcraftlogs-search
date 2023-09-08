export interface TalentData {
    abilities: Ability[];
    sharedStrings: Record<string, string>;
    trees: Tree[];
    pvp: PvpTalent[];
    nodes: Record<string, number[]>;
    specGuides: SpecGuide[];
    specRoles: Record<string, 0 | 1 | 2>;
    guideURLs: Record<string, string>;
}

export interface Ability {
    playerClass: number;
    spec: number | null;
    passive: 0 | 1;
    id: number;
    skillCategory: number;
    name: string;
    minLevel: number;
    icon: string;
}

export interface Tree {
    id: number;
    talents: Record<string, Talent>;
}

export interface Talent {
    cell: number;
    defaultSpecs: number[];
    node: number;
    requiredPoints: number;
    requires: number[];
    spells: Spell[];
    type: number;
    cannotDecreaseError?: number;
}

export interface Spell {
    icon: string;
    name: string;
    points: number;
    description: string;
    descriptionSearch: string;
    spell: number;
    definition: number;
    hasRankDescription: 1 | 0;
}

export interface PvpTalent {
    id: number;
    name: string;
    icon: string;
    specs: number[];
}

export interface SpecGuide {
    id: number;
    specId: number;
}
