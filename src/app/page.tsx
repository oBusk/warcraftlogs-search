import { Suspense } from "react";
import ClassPickers from "^/components/ClassPickers";
import Rankings from "^/components/Rankings";
import TalentPicker from "^/components/TalentPicker";
import ZonePickers from "^/components/ZonePickers";
import { PARAM_NAMES } from "^/lib/PARAM_NAMES";
import { forceToNumber } from "^/lib/utils";

interface HomeSearchParams {
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

export default function Home({
    searchParams: {
        [PARAM_NAMES.partition]: partitionParam,
        [PARAM_NAMES.encounter]: encounterParam,
        [PARAM_NAMES.classId]: classParam,
        [PARAM_NAMES.specId]: specParam,
        [PARAM_NAMES.talentSpellId]: talentParam,
        [PARAM_NAMES.page]: pageParam,
    },
}: HomeProps) {
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
