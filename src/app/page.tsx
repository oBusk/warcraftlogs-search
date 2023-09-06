import EncounterPicker from "^/components/EncounterPicker";
import PartitionPicker from "^/components/PartitionPicker";
import Rankings from "^/components/Rankings";
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
}

interface HomeProps {
    searchParams: HomeSearchParams;
}

export default function Home({
    searchParams: {
        zone: zoneParam,
        partition: partitionParam,
        encounter: encounterParam,
    },
}: HomeProps) {
    const zone = forceToNumber(zoneParam);
    const partition = forceToNumber(partitionParam);
    const encounter = forceToNumber(encounterParam);

    return (
        <div>
            <div className="flex space-x-2 mb-4 px-8">
                <ZonePicker zone={zone} />
                {zone != null && (
                    <>
                        <PartitionPicker zone={zone} partition={partition} />
                        <EncounterPicker zone={zone} encounter={encounter} />
                    </>
                )}
            </div>
            {encounter != null && <Rankings encounter={encounter} />}
        </div>
    );
}
