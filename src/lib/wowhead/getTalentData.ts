import { TalentData } from "./types";

export async function getTalentData() {
    const data = await fetch(
        "https://nether.wowhead.com/data/talents-dragonflight",
    );

    const fullText = await data.text();

    const blocks = fullText.split(/\n/);

    const dataObj = blocks
        .map((block) => block.match(/WH\.setPageData\(\"([\w\.]+)", (.+)\);$/)!)
        .filter((x) => x != null)
        .map((x) => Array.from(x))
        .reduce((acc, [_, key, value]) => {
            const parsed = JSON.parse(value);
            return {
                ...acc,
                [key.replace(/^wow\.talentCalcDragonflight\.live\./, "")]:
                    parsed,
            };
        }, {});

    return dataObj as TalentData;
}
