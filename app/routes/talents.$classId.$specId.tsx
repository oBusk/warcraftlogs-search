import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Inspect } from "^/components/Inspect";
import { nullGetTalents } from "^/lib/nullGetTalents";

export const meta: MetaFunction = () => {
    return [{ title: "Talents | Warcraftlogs Search" }];
};

export async function loader({ params }: LoaderFunctionArgs) {
    const classId = Number(params.classId);
    const specId = Number(params.specId);

    const data = await nullGetTalents(classId, specId);

    return json({ data });
}

export default function TalentsPage() {
    const { data } = useLoaderData<typeof loader>();

    return <Inspect data={data} />;
}
