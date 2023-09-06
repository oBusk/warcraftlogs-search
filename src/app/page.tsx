import { Suspense } from "react";
import ClassPicker from "^/components/ClassPicker";
import EncounterPicker from "^/components/EncounterPicker";
import PartitionPicker from "^/components/PartitionPicker";
import Rankings from "^/components/Rankings";
import SpecPicker from "^/components/SpecPicker";
import ZonePicker from "^/components/ZonePicker";

function forceToNumber(
    value: string | string[] | undefined,
): number | undefined {
    if (value == null) {
        return undefined;
    }

    if (Array.isArray(value)) {
        return parseInt(value[0]);
    }

    return parseInt(value);
}

interface HomeSearchParams {
    zone?: string;
    partition?: string;
    encounter?: string;
    class?: string;
    spec?: string;
}

interface HomeProps {
    searchParams: HomeSearchParams;
}

export default function Home({
    searchParams: {
        zone: zoneParam,
        partition: partitionParam,
        encounter: encounterParam,
        class: classParam,
        spec: specParam,
    },
}: HomeProps) {
    const zone = forceToNumber(zoneParam);
    const partition = forceToNumber(partitionParam);
    const encounter = forceToNumber(encounterParam);
    const klass = forceToNumber(classParam);
    const spec = forceToNumber(specParam);

    return (
        <div>
            <div className="flex space-x-2 mb-4 px-8">
                <Suspense>
                    <ZonePicker zone={zone} />
                </Suspense>
                {zone != null && (
                    <>
                        <Suspense>
                            <EncounterPicker
                                zone={zone}
                                encounter={encounter}
                            />
                            <PartitionPicker
                                zone={zone}
                                partition={partition}
                            />
                        </Suspense>
                    </>
                )}
            </div>
            <div className="flex space-x-2 mb-4 px-8">
                <Suspense>
                    <ClassPicker klass={klass} />
                </Suspense>
                {klass != null && (
                    <Suspense>
                        <SpecPicker klassId={klass} specId={spec} />
                    </Suspense>
                )}
            </div>
            {encounter != null && (
                <Suspense fallback={<div className="px-8">Loading...</div>}>
                    <Rankings
                        className="px-8"
                        encounter={encounter}
                        partition={partition}
                        klass={klass}
                        spec={spec}
                    />
                </Suspense>
            )}
        </div>
    );
}
