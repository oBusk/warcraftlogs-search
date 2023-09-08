import { Inspect } from "^/components/Inspect";
import { getTalentTrees } from "^/lib/wow/talents";

export const metadata = {
    title: "WoW",
};

export default async function WoWPage() {
    let data: any;
    try {
        data = await getTalentTrees();
    } catch (error) {
        console.error(error);
    }

    return data != null ? <Inspect data={data} /> : <div>Nothing</div>;
}
