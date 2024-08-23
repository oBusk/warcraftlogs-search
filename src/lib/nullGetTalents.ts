import { getTalentTrees } from "./raidbots/getTalentTrees";
import { type TalentNode } from "./raidbots/TalentTree";
import { getClass } from "./wcl/classes";

/**
 * A terrible name for our own representation of talents.
 */
export interface NullTalent {
    name: string;
    talentId: number;
}

/**
 * Method that takes WCL classId and specId and returns a list of talents from Raidbots static talents data
 */
export async function nullGetTalents(
    /** According to WCL */
    classId: number,
    /** According to WCL (which seems to match with WoW) */
    specId: number,
) {
    const [{ className, specName }, talentTrees] = await Promise.all([
        getClass(classId).then((klass) => {
            if (klass == null) {
                throw new Error(`Could not find class with id ${classId}`);
            }

            const spec = klass.specs.find(({ id }) => `${id}` === `${specId}`);

            if (spec == null) {
                throw new Error(
                    `Could not find spec with id ${specId} for class ${name}`,
                );
            }

            return {
                className: klass.name,
                specName: spec.name,
            };
        }),
        getTalentTrees(),
    ]);

    const talentTree = talentTrees.find(
        // Use names because WarcarftLogs IDs does not match with Raidbots IDs
        (x) => x.className === className && x.specName === specName,
    );

    if (talentTree == null) {
        throw new Error(
            `No talent tree found for classId: ${classId}, specId: ${specId}`,
        );
    }

    const { classNodes, specNodes, heroNodes, subTreeNodes } = talentTree;

    const talentNodes = [
        ...classNodes,
        ...specNodes,
        ...heroNodes,
        ...subTreeNodes,
    ];

    const nullTalents = talentNodesToNullTalents(talentNodes);

    const deduplicated: NullTalent[] = [];

    nullTalents.forEach((talent) => {
        if (
            deduplicated.find(
                (x) => x.name === talent.name && x.talentId === talent.talentId,
            ) == null
        ) {
            deduplicated.push(talent);
        }
    });

    return nullTalents;
}

function talentNodesToNullTalents(talentNodes: TalentNode[]): NullTalent[] {
    return talentNodes.flatMap((talentNode): NullTalent[] => {
        const entries = talentNode.entries;

        if (!(entries?.length > 0)) {
            console.error("Talent", talentNode, "has no entries");
            throw new Error("Talent has no entries");
        }

        if (entries.some((entry) => entry.id == null || entry.name == null)) {
            console.log(talentNode);
            throw new Error("Talent has a entry with no id or no name");
        }

        return entries.map(({ name, id }) => ({ name, talentId: id }));
    });
}
