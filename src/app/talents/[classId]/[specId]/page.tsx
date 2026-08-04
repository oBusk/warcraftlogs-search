import { Inspect } from "^/components/Inspect";
import { nullGetTalents } from "^/lib/nullGetTalents";

export const metadata = {
    title: "Talents",
};

export const instant = false;

interface Params {
    classId: string;
    specId: string;
}

export interface TalentsPageProps {
    params: Promise<Params>;
}

export default async function TalentsPage({ params }: TalentsPageProps) {
    const { classId, specId } = await params;

    const data = await nullGetTalents(Number(classId), Number(specId));

    return <Inspect data={data} />;
}
