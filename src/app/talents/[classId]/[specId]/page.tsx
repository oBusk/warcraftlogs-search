import { Inspect } from "^/components/Inspect";
import { nullGetTalents } from "^/lib/nullGetTalents";

export interface TalentsPageProps {
    params: { classId: number; specId: number };
}

export default async function TalentsPage({
    params: { classId, specId },
}: TalentsPageProps) {
    const data = await nullGetTalents(classId, specId);

    return <Inspect data={data} />;
}
