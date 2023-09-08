import { Suspense } from "react";
import ClassPickers from "^/components/ClassPickers";
import Rankings from "^/components/Rankings";
import TalentPicker from "^/components/TalentPicker";
import ZonePickers from "^/components/ZonePickers";
import { forceToNumber } from "^/lib/utils";

interface HomeSearchParams {
    zone?: string;
    partition?: string;
    encounter?: string;
    class?: string;
    spec?: string;
    talent?: string;
}

interface HomeProps {
    searchParams: HomeSearchParams;
}

export default function Home({
    searchParams: {
        partition: partitionParam,
        encounter: encounterParam,
        class: classParam,
        spec: specParam,
        talent: talentParam,
    },
}: HomeProps) {
    const partition = forceToNumber(partitionParam);
    const encounter = forceToNumber(encounterParam);
    const klass = forceToNumber(classParam);
    const spec = forceToNumber(specParam);
    const talent = forceToNumber(talentParam);

    return (
        <>
            <ZonePickers className="flex space-x-2 mb-4 px-8" />
            <div className="flex space-x-2 mb-4 px-8">
                <ClassPickers className="flex space-x-2" />
                <div className="flex-1" />
                <TalentPicker />
            </div>
            <Suspense>
                {encounter != null && (
                    <Rankings
                        className="px-8"
                        encounter={encounter}
                        partition={partition}
                        klass={klass}
                        spec={spec}
                        talent={talent}
                    />
                )}
            </Suspense>
        </>
    );
}
