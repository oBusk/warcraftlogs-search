import { type ResolvingMetadata } from "next";
import { Suspense } from "react";
import ClassPickers from "^/components/ClassPickers";
import ItemPicker from "^/components/ItemPicker/ItemPicker";
import Rankings from "^/components/Rankings";
import TalentPicker from "^/components/TalentPicker";
import ZonePickers from "^/components/ZonePickers";
import { parseParams, type RawParams } from "^/lib/Params";
import { isNotNull } from "^/lib/utils";
import { getClasses } from "^/lib/wcl/classes";
import { getZones } from "^/lib/wcl/zones";

interface HomeProps {
    searchParams: RawParams;
}

export async function generateMetadata(
    { searchParams }: HomeProps,
    parent: ResolvingMetadata,
) {
    const { encounter, classId, specId, talents } = parseParams(searchParams);

    if (!encounter) {
        return {
            ...parent,
            title: "Search | Warcraftlogs Search",
        };
    }

    const [encounters, classes] = await Promise.all([getZones(), getClasses()]);

    const talentNames = talents
        .map(({ name, spellId }) => name ?? spellId)
        .filter(isNotNull)
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
        .join("+");

    const klass =
        classId != null ? classes.find((c) => c.id === classId) : null;
    const spec =
        specId != null ? klass?.specs.find((s) => s.id === specId) : null;

    const encounterName = encounters
        .find((z) => z.encounters.some((e) => e.id === encounter))
        ?.encounters.find((e) => e.id === encounter)?.name;

    const title = [talentNames, spec?.name, klass?.name, encounterName]
        .filter(isNotNull)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .join(" - ");

    return {
        ...parent,
        title: `${title} Results | Warcraftlogs Search`,
    };
}

export default function Home({ searchParams }: HomeProps) {
    const {
        classId,
        specId,
        encounter,
        difficulty,
        partition,
        metric,
        pages,
        region,
        talents,
        itemFilters,
    } = parseParams(searchParams);

    return (
        <>
            <ZonePickers className="mb-4 flex space-x-2 px-8" />
            <ClassPickers className="mb-4 flex space-x-2 px-8" />
            <TalentPicker
                className="mb-4 flex items-start space-x-2 px-8"
                classId={classId}
                specId={specId}
            />
            <ItemPicker
                className="mb-4 flex items-start space-x-2 px-8"
                itemFilters={itemFilters}
            />
            <Suspense
                fallback={
                    <div className="flex justify-center p-8">Loading...</div>
                }
                key={JSON.stringify(searchParams)}
            >
                {encounter != null && (
                    <Rankings
                        className="px-8"
                        region={region}
                        encounter={encounter}
                        difficulty={difficulty}
                        partition={partition}
                        metric={metric}
                        klass={classId}
                        spec={specId}
                        talents={talents}
                        itemFilters={itemFilters}
                        pages={pages}
                    />
                )}
            </Suspense>
        </>
    );
}
