import { type Scope } from "./scope";
import { type TalentTree } from "./TalentTree";

export async function getTalentTrees(scope: Scope = "live") {
    let response: Response;
    try {
        response = await fetch(
            `https://www.raidbots.com/static/data/${scope}/talents.json`,
            // The data is larger than 2MB, so we're not allowed to cache it.
            { cache: "no-store" },
        );
    } catch (e) {
        console.error("[getTalentsData] Failed: Fetching", {
            error: e,
        });

        throw e;
    }

    let data: TalentTree[];
    try {
        data = await response.json();
    } catch (e) {
        console.error("[getTalentsData] Failed: Parsing", {
            error: e,
        });

        throw e;
    }

    return data;
}
