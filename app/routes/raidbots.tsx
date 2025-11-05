import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getTalentTrees } from "^/lib/raidbots/getTalentTrees";

export async function loader() {
    const talentsData = await getTalentTrees();

    return json({ talentsData });
}

export default function Raidbots() {
    const { talentsData } = useLoaderData<typeof loader>();

    return (
        <div>
            <h1>Raidbots</h1>
            <pre>{JSON.stringify(talentsData, null, 2)}</pre>
        </div>
    );
}
