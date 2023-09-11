import { ResolvingMetadata } from "next";
import { Suspense } from "react";
import ClassPickers from "^/components/ClassPickers";
import Rankings from "^/components/Rankings";
import TalentPicker from "^/components/TalentPicker";
import ZonePickers from "^/components/ZonePickers";
import { parseParams, RawParams } from "^/lib/Params";
import { getClasses } from "^/lib/wcl/classes";
import { getZones } from "^/lib/wcl/zones";

interface HomeProps {
    searchParams: RawParams;
}

export async function generateMetadata(
    { searchParams }: HomeProps,
    parent: ResolvingMetadata,
) {
    const { encounter } = parseParams(searchParams);

    if (!encounter) {
        return {
            ...parent,
            title: "Search | wcl.nulldozzer.io",
        };
    }

    const [encounters] = await Promise.all([getZones(), getClasses()]);

    const encounterName = encounters
        .find((z) => z.encounters.some((e) => e.id === encounter))
        ?.encounters.find((e) => e.id === encounter)?.name;

    return {
        ...parent,
        title: `${encounterName} Rankings | wcl.nulldozzer.io`,
    };
}

export default function Home({ searchParams }: HomeProps) {
    const {
        classId,
        specId,
        encounter,
        partition,
        pages,
        region,
        talentSpellId,
    } = parseParams(searchParams);

    return (
        <>
            <ZonePickers className="flex space-x-2 mb-4 px-8" />
            <div className="flex space-x-2 mb-4 px-8">
                <ClassPickers className="flex space-x-2" />
                <div className="flex-1" />
                <TalentPicker classId={classId} specId={specId} />
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                {encounter != null && (
                    <Rankings
                        className="px-8"
                        region={region}
                        encounter={encounter}
                        partition={partition}
                        klass={classId}
                        spec={specId}
                        talent={talentSpellId}
                        pages={pages}
                    />
                )}
            </Suspense>
        </>
    );
}
