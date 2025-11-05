import { getTalentTrees } from "./getTalentTrees";
import { type Scope } from "./scope";
import {
    type TalentEntry,
    type TalentNode,
    type TalentTree,
} from "./TalentTree";

export interface LiteTalentTree {
    classId: number;
    className: string;
    specId: number;
    specName: string;
    classNodes: LiteTalentNode[];
    specNodes: LiteTalentNode[];
    heroNodes: LiteTalentNode[];
    subTreeNodes: LiteTalentNode[];
}

export interface LiteTalentNode {
    id: number;
    name: string;
    entries: LiteTalentEntry[];
}

export type LiteTalentEntry = Pick<
    TalentEntry,
    "id" | "name" | "spellId" | "icon"
>;

export async function getLiteTalentTrees(
    scope: Scope = "live",
): Promise<LiteTalentTree[]> {
    const talentTrees = await getTalentTrees(scope);

    return talentTrees.map(
        ({
            classId,
            className,
            specId,
            specName,
            classNodes,
            specNodes,
            heroNodes,
            subTreeNodes,
        }: TalentTree): LiteTalentTree => ({
            classId,
            className,
            specId,
            specName,
            classNodes: classNodes.map(mapTalentNode),
            specNodes: specNodes.map(mapTalentNode),
            heroNodes: heroNodes.map(mapTalentNode),
            subTreeNodes: subTreeNodes.map(mapTalentNode),
        }),
    );
}

function mapTalentNode({ id, name, entries }: TalentNode): LiteTalentNode {
    return {
        id: id,
        name: name,
        entries: entries.map(mapTalentEntry),
    };
}

function mapTalentEntry({
    id,
    name,
    spellId,
    icon,
}: TalentEntry): LiteTalentEntry {
    return { id, name, spellId, icon };
}
