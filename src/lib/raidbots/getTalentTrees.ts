import { measuredPromise } from "../utils";
import { type RaidbotsScope } from "./scope";
import { type TalentTree } from "./TalentTree";

export async function getTalentTrees(scope: RaidbotsScope = "live") {
    let response: Response;
    let time: number;
    try {
        ({ result: response, time } = await measuredPromise(
            fetch(
                `https://www.raidbots.com/static/data/${scope}/talents.json`,
                // The data is larger than 2MB, so we're not allowed to cache it.
                { cache: "no-store" },
            ),
        ));
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

    console.log("[getTalentsData] Completed", {
        time,
    });
    return data;
}
