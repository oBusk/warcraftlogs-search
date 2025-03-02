import { Inspect } from "^/components/Inspect";
import { nullGetTalents } from "^/lib/nullGetTalents";

export const metadata = {
    title: "Talents",
};

export interface TalentsPageProps {
    params: Promise<{ classId: number; specId: number }>;
}

export default async function TalentsPage(props: TalentsPageProps) {
    const params = await props.params;

    const { classId, specId } = params;

    const data = await nullGetTalents(classId, specId);

    return <Inspect data={data} />;
}
