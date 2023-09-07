import Rankings from "^/components/Rankings";
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
        encounter != null && (
            <Rankings
                className="px-8"
                encounter={encounter}
                partition={partition}
                klass={klass}
                spec={spec}
                talent={talent}
            />
        )
    );
}
