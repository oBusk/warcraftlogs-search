import type NameId from "../NameId";
import { type KeyProp, type NameIdKey, type WowResponse } from "./types";
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

// interface TalentTreeResult extends WowResponse {
//     id: number;
//     spec_talent_trees: TalentTree[];
//     talent_nodes: TalentNode[];
// }

interface BaseTalentNode {
    id: number;
    display_row: number;
    display_col: number;
    raw_position_x: number;
    raw_position_y: number;
}

interface ActiveTalentNode extends BaseTalentNode {
    node_type: NodeTypeActive;
    ranks: TalentRank[];
}

interface PassiveTalentNode extends BaseTalentNode {
    node_type: NodeTypePassive;
    ranks: TalentRank[];
}

interface ChoiceTalentNode extends BaseTalentNode {
    node_type: NodeTypeChoice;
    ranks: ChoiceTalentRank[];
}

export type TalentNode =
    | ActiveTalentNode
    | PassiveTalentNode
    | ChoiceTalentNode;

interface NodeTypeActive {
    id: 0;
    type: "ACTIVE";
}

interface NodeTypePassive {
    id: 1;
    type: "PASSIVE";
}

interface NodeTypeChoice {
    id: 2;
    type: "CHOICE";
}

// type NodeType = NodeTypeActive | NodeTypePassive | NodeTypeChoice;

interface TalentRank {
    rank: number;
    tooltip: TalentTooltip;
}

interface ChoiceTalentRank {
    choice: number;
    choice_of_tooltips: [TalentTooltip, TalentTooltip];
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

interface RestrictionLine {
    required_points: number;
    restricted_row: number;
    is_for_class: boolean;
}

interface SpecTalentTree extends NameId, WowResponse {
    media: KeyProp;
    playable_class: NameIdKey;
    playable_specialization: NameIdKey;
    restriction_lines: RestrictionLine[];
    class_talent_nodes: TalentNode[];
    spec_talent_nodes: TalentNode[];
}

export async function getTalentTree(specName: string) {
    const { spec_talent_trees } = await getTalentTrees();

    const specTalentTreeHref = spec_talent_trees.find(
        ({ name }) => name === specName,
    )?.key.href;

    if (specTalentTreeHref == null) {
        console.warn("Could not find spec talent tree", {
            specName,
            spec_talent_trees,
        });

        return {
            class_talent_nodes: [],
            spec_talent_nodes: [],
        } as any as SpecTalentTree;
    }

    const specTalentTree = await wowFetch<SpecTalentTree>({
        url: specTalentTreeHref,
    });

    return specTalentTree;
}

export function isChoiceNode(node: TalentNode): node is ChoiceTalentNode {
    return node.node_type.type === "CHOICE";
}
