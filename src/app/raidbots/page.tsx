import { getTalentTrees } from "^/lib/raidbots/getTalentTrees";

export default async function Raidbots() {
    const talentsData = await getTalentTrees();

    return (
        <div>
            <h1>Raidbots</h1>
            <pre>{JSON.stringify(talentsData, null, 2)}</pre>
        </div>
    );
}
