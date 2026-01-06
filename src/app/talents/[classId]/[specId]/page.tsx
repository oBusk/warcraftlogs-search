import { Suspense } from "react";
import { Inspect } from "^/components/Inspect";
import { nullGetTalents } from "^/lib/nullGetTalents";

export const metadata = {
    title: "Talents",
};

interface Params {
    classId: string;
    specId: string;
}

export interface TalentsPageProps {
    params: Promise<Params>;
}

async function InnerTalentsPage({ params }: TalentsPageProps) {
    const { classId, specId } = await params;

    const data = await nullGetTalents(Number(classId), Number(specId));

    return <Inspect data={data} />;
}

export default async function TalentsPage(props: TalentsPageProps) {
    return (
        <Suspense>
            <InnerTalentsPage {...props} />
        </Suspense>
    );
}
