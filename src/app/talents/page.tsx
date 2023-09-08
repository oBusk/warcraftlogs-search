import { getTalentData } from "^/lib/wowhead/getTalentData";

export default async function Page() {
    const { trees } = await getTalentData();

    return <pre>{JSON.stringify(trees, null, 2)}</pre>;
}
