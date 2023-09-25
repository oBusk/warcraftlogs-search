import { getClass } from "./wcl/classes";
import { getTalentTree, isChoiceNode, TalentNode } from "./wow/talents";

/**
 * A terrible name for our own representation of talents.
 */
export interface NullTalent {
    name: string;
    spellId: number;
}

/**
 * Method that takes WCL classId and specId and returns a list of talents from Bnet WOW API.
 */
export async function nullGetTalents(
    /** According to WCL */
    classId: number,
    /** According to WCL (which seems to match with WoW) */
    specId: number,
) {
    const { name, specs } = await getClass(classId);

    const spec = specs.find(({ id }) => `${id}` === `${specId}`);

    if (spec == null) {
        throw new Error(
            `Could not find spec with id ${specId} for class ${name}`,
        );
    }

    const { class_talent_nodes, spec_talent_nodes } = await getTalentTree(
        spec.name,
    );

    const talentNodes = [...class_talent_nodes, ...spec_talent_nodes];

    const nullTalents = talentNodesToNullTalents(talentNodes);

    const deduplicated: NullTalent[] = [];

    nullTalents.forEach((talent) => {
        if (
            deduplicated.find(
                (x) => x.name === talent.name && x.spellId === talent.spellId,
            ) == null
        ) {
            deduplicated.push(talent);
        }
    });

    return nullTalents;
}

function talentNodesToNullTalents(talentNodes: TalentNode[]): NullTalent[] {
    return talentNodes.flatMap((talentNode): NullTalent[] => {
        if (talentNode.ranks?.[0] == null) {
            // Because the data is _shit_, ranks can be null
            return [];
        }

        const spells = isChoiceNode(talentNode)
            ? talentNode.ranks[0].choice_of_tooltips.map(
                  (x) => x.spell_tooltip.spell,
              )
            : [talentNode.ranks[0].tooltip.spell_tooltip.spell];

        return spells.map(({ name, id }) => ({ name, spellId: id }));
    });
}
