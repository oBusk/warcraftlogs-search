import { Inspect } from "^/components/Inspect";
import { nullGetTalents } from "^/lib/nullGetTalents";

export const metadata = {
    title: "Talents",
};

// Enable caching for talent pages
export const revalidate = 86400; // 24 hours - talent data rarely changes

export interface TalentsPageProps {
    params: Promise<{ classId: number; specId: number }>;
}

export default async function TalentsPage(props: TalentsPageProps) {
    const params = await props.params;

    const { classId, specId } = params;

    const data = await nullGetTalents(classId, specId);

    return <Inspect data={data} />;
}
