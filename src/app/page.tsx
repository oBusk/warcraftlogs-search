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
                <ZonePicker zone={zone} />
                {zone != null && (
                    <>
                        <EncounterPicker zone={zone} encounter={encounter} />
                        <PartitionPicker zone={zone} partition={partition} />
                    </>
                )}
            </div>
            <div className="flex space-x-2 mb-4 px-8">
                <ClassPicker klass={klass} />
                {klass != null && <SpecPicker klassId={klass} specId={spec} />}
            </div>
            {encounter != null && (
                <Rankings
                    encounter={encounter}
                    partition={partition}
                    klass={klass}
                    spec={spec}
                />
            )}
        </div>
    );
}
