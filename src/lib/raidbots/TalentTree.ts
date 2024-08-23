export interface TalentTree {
    traitTreeId: number;
    className: string;
    classId: number;
    specName: string;
    specId: number;
    classNodes: TalentNode[];
    specNodes: TalentNode[];
    heroNodes: TalentNode[];
    subTreeNodes: TalentNode[];
}

export interface TalentNode {
    id: number;
    name: string;
    type: TalentNodeType;
    posX: number;
    posY: number;
    maxRanks: number;
    entryNode?: true;
    next: number[];
    prev: number[];
    entries: TalentEntry[];
    freeNode?: true;
}

export type TalentNodeType = "single" | "choice";

export interface TalentEntry {
    id: number;
    definitionId: number;
    maxRanks: number;
    type: TalentEntryType;
    name: string;
    spellId: number;
    icon: string;
    index: number;
}

export type TalentEntryType = "passive" | "active";
