import { ResolvingMetadata } from "next";
import { Suspense } from "react";
import ClassPickers from "^/components/ClassPickers";
import Rankings from "^/components/Rankings";
import TalentPicker from "^/components/TalentPicker";
import ZonePickers from "^/components/ZonePickers";
import { PARAM_NAMES } from "^/lib/PARAM_NAMES";
import { forceToNumber } from "^/lib/utils";
import { getClasses } from "^/lib/wcl/classes";
import { getZones } from "^/lib/wcl/zones";

interface HomeSearchParams {
    [PARAM_NAMES.region]?: string;
    [PARAM_NAMES.zone]?: string;
    [PARAM_NAMES.partition]?: string;
    [PARAM_NAMES.classId]?: string;
    [PARAM_NAMES.specId]?: string;
    [PARAM_NAMES.encounter]?: string;
    [PARAM_NAMES.talentSpellId]?: string;
    [PARAM_NAMES.page]?: string;
}

interface HomeProps {
    searchParams: HomeSearchParams;
}

export async function generateMetadata(
    { searchParams: { [PARAM_NAMES.encounter]: encounterParam } }: HomeProps,
    parent: ResolvingMetadata,
) {
    const encounter = forceToNumber(encounterParam);

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

export default function Home({
    searchParams: {
        [PARAM_NAMES.region]: regionParam,
        [PARAM_NAMES.partition]: partitionParam,
        [PARAM_NAMES.encounter]: encounterParam,
        [PARAM_NAMES.classId]: classParam,
        [PARAM_NAMES.specId]: specParam,
        [PARAM_NAMES.talentSpellId]: talentParam,
        [PARAM_NAMES.page]: pageParam,
    },
}: HomeProps) {
    const region = regionParam;
    const partition = forceToNumber(partitionParam);
    const encounter = forceToNumber(encounterParam);
    const klass = forceToNumber(classParam);
    const spec = forceToNumber(specParam);
    const talent = forceToNumber(talentParam);
    const page = pageParam?.split(",").map(Number) ?? [1];

    return (
        <>
            <ZonePickers className="flex space-x-2 mb-4 px-8" />
            <div className="flex space-x-2 mb-4 px-8">
                <ClassPickers className="flex space-x-2" />
                <div className="flex-1" />
                <TalentPicker classId={klass} specId={spec} />
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                {encounter != null && (
                    <Rankings
                        className="px-8"
                        region={region}
                        encounter={encounter}
                        partition={partition}
                        klass={klass}
                        spec={spec}
                        talent={talent}
                        page={page}
                    />
                )}
            </Suspense>
        </>
    );
}
