import NameId from "../NameId";
import { KeyProp, NameIdKey, WowResponse } from "./types";
import { NAMESPACES, wowFetch } from "./wowFetch";

export interface IndexTalent extends NameId, KeyProp {}

export interface TalentsResponse extends WowResponse {
    talents: IndexTalent[];
}

export async function getTalents() {
    const talents = await wowFetch<TalentsResponse>({
        endpoint: `talent/index`,
        namespace: NAMESPACES.Static,
    });

    return talents;
}

export interface RankDescription {
    rank: number;
    description: string;
}

export interface TalentResponse extends WowResponse {
    id: number;
    rank_descriptions: RankDescription[];
    spell: NameIdKey;
    playable_class: NameIdKey;
    playable_specialization: NameIdKey;
}

export async function getTalent(talentId: number) {
    const talent = await wowFetch<any>({
        endpoint: `talent/${talentId}`,
        namespace: NAMESPACES.Static,
    });

    return talent;
}

export interface TalentTree extends KeyProp {
    name: string;
}

export interface TalentTreeResponse extends WowResponse {
    spec_talent_trees: TalentTree[];
    class_talent_trees: TalentTree[];
}

export async function getTalentTrees() {
    const talentTrees = await wowFetch<TalentTreeResponse>({
        endpoint: `talent-tree/index`,
        namespace: NAMESPACES.Static,
    });

    return talentTrees;
}

interface TalentTreeResult extends WowResponse {
    id: number;
    spec_talent_trees: TalentTree[];
    talent_nodes: TalentNode[];
}

interface TalentNode {
    id: number;
    node_type: NodeType;
    ranks: TalentRank[];
    display_row: number;
    display_col: number;
    raw_position_x: number;
    raw_position_y: number;
}

interface NodeType {
    id: number;
    type: "PASSIVE" | "ACTIVE";
}

interface TalentRank {
    rank: number;
    tooltip: TalentTooltip;
}

interface TalentTooltip {
    talent: NameIdKey;
    spell_tooltip: SpellTooltip;
}

interface SpellTooltip {
    spell: NameIdKey;
    description: string;
    cast_time: number | "Passive" | "Instant";
}

export async function getTalentTree(specName: string) {
    const { class_talent_trees } = await getTalentTrees();

    const talentTree = class_talent_trees.find(({ name }) => name === specName);

    if (!talentTree) {
        throw new Error(`Talent tree for ${specName} not found`);
    }

    const result = await wowFetch<TalentTreeResult>({
        url: talentTree.key.href,
    });

    return result;
}
