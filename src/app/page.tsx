import { type ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ClassPickers from "^/components/ClassPickers";
import ItemPicker from "^/components/ItemPicker/ItemPicker";
import Rankings from "^/components/Rankings";
import TalentPicker from "^/components/TalentPicker";
import ZonePickers from "^/components/ZonePickers";
import { parseParams, type RawParams } from "^/lib/Params";
import { generateCanonicalUrl, shouldNoIndex } from "^/lib/seo-utils";
import { isNotNull } from "^/lib/utils";
import { getClasses } from "^/lib/wcl/classes";
import { getZones } from "^/lib/wcl/zones";

// This page is dynamic, so caching would be ignored. Remove the setting.

interface HomeProps {
    searchParams: Promise<RawParams>;
}

export async function generateMetadata(
    props: HomeProps,
    parent: ResolvingMetadata,
) {
    const searchParams = await props.searchParams;
    const { encounter, classId, specId, talents } = parseParams(searchParams);

    const shouldBlock = shouldNoIndex(searchParams);
    const canonical = generateCanonicalUrl(searchParams);

    const metadata = {
        ...parent,
        alternates: {
            canonical,
        },
        robots: shouldBlock ? "noindex, nofollow" : "index, follow",
    };

    if (!encounter) {
        return {
            ...metadata,
            title: "Search | Warcraftlogs Search",
        };
    }

    const [encounters, classes] = await Promise.all([getZones(), getClasses()]);

    const talentNames = talents
        .map(({ name, talentId }) => name ?? talentId)
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
        ...metadata,
        title: `${title} Results | Warcraftlogs Search`,
    };
}

export default async function Home(props: HomeProps) {
    const searchParams = await props.searchParams;
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

    // Parallelize API calls for validation
    const needsZones = encounter != null;
    const needsClasses = classId != null;

    const [zones, classes] = await Promise.all([
        needsZones ? getZones() : Promise.resolve(null),
        needsClasses ? getClasses() : Promise.resolve(null),
    ]);

    // Validate encounter exists if provided
    if (encounter != null && zones != null) {
        const validEncounter = zones.some((zone) =>
            zone.encounters.some((enc) => enc.id === encounter),
        );

        if (!validEncounter) {
            notFound();
        }
    }

    // Validate class exists if provided
    if (classId != null && classes != null) {
        const validClass = classes.some((cls) => cls.id === classId);

        if (!validClass) {
            notFound();
        }

        // Validate spec exists for the given class if both are provided
        if (specId != null) {
            const klass = classes.find((cls) => cls.id === classId);
            const validSpec = klass?.specs.some((spec) => spec.id === specId);

            if (!validSpec) {
                notFound();
            }
        }
    }

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
