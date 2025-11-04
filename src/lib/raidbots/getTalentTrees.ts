import { measuredPromise } from "../utils";
import { type Scope } from "./scope";
import { type TalentTree } from "./TalentTree";

export async function getTalentTrees(scope: Scope = "live") {
    let response: Response;
    let time: number;
    try {
        ({ result: response, time } = await measuredPromise(
            fetch(
                `https://www.raidbots.com/static/data/${scope}/talents.json`,
                {
                    next: {
                        revalidate: 86400, // 24 hours - talent data changes infrequently
                        tags: [`raidbots-talents-${scope}`],
                    },
                },
            ),
        ));
    } catch (e) {
        console.error("[getTalentsData] Failed: Fetching", {
            error: e,
            scope,
        });

        throw e;
    }

    let data: TalentTree[];
    try {
        data = await response.json();
    } catch (e) {
        console.error("[getTalentsData] Failed: Parsing", {
            error: e,
            scope,
        });

        throw e;
    }

    console.log("[getTalentsData] Completed", {
        time,
        scope,
    });
    return data;
}
