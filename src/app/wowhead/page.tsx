import { Inspect } from "^/components/Inspect";
import { getTalentData } from "^/lib/wowhead/getTalentData";

export default async function WowheadPage() {
    const data = await getTalentData();

    return <Inspect data={data} />;
}
