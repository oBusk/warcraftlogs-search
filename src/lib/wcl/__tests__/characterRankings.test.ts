import { trimCharacterRankings } from "../characterRankings";

const rawRanking = {
    name: "Someone",
    class: "Priest",
    spec: "Shadow",
    amount: 1234.5,
    hardModeLevel: 0,
    duration: 300000,
    startTime: 1700000000000,
    bracketData: 1,
    faction: 2,
    report: { code: "abc", fightID: 7, startTime: 1700000000000 },
    guild: { id: 1, name: "Guild", faction: 2 },
    server: { id: 3, name: "Server", region: "US" },
    talents: [
        { name: "Talent", id: 10, talentID: 20, points: 1, icon: "icon.jpg" },
    ],
    gear: [
        {
            name: "Helm",
            quality: "epic",
            id: 100,
            icon: "helm.jpg",
            itemLevel: "600",
            bonusIDs: ["1", "2"],
            gems: [{ id: "5", itemLevel: "600" }],
            permanentEnchant: "7",
            temporaryEnchant: "8",
        },
    ],
};

const rawCharacterRankings = {
    page: 1,
    hasMorePages: true,
    count: 42,
    rankings: [rawRanking],
};

// The WCL payload carries fields our types deliberately no longer declare.
const trim = (raw: unknown) =>
    trimCharacterRankings(raw as Parameters<typeof trimCharacterRankings>[0]);

describe("trimCharacterRankings", () => {
    test("keeps the pagination fields", () => {
        const { page, hasMorePages, count } = trim(rawCharacterRankings);

        expect({ page, hasMorePages, count }).toEqual({
            page: 1,
            hasMorePages: true,
            count: 42,
        });
    });

    test("drops the ranking fields nothing reads", () => {
        const [ranking] = trim(rawCharacterRankings).rankings;

        expect(Object.keys(ranking).sort()).toEqual([
            "amount",
            "class",
            "gear",
            "guild",
            "name",
            "report",
            "spec",
            "talents",
        ]);
    });

    test("keeps the fields rendering and filtering need", () => {
        const [ranking] = trim(rawCharacterRankings).rankings;

        expect(ranking).toEqual({
            name: "Someone",
            class: "Priest",
            spec: "Shadow",
            amount: 1234.5,
            report: { code: "abc", fightID: 7, startTime: 1700000000000 },
            guild: { name: "Guild" },
            talents: [{ name: "Talent", talentID: 20 }],
            gear: [
                {
                    id: 100,
                    name: "Helm",
                    bonusIDs: ["1", "2"],
                    gems: [{ id: "5" }],
                    permanentEnchant: "7",
                    temporaryEnchant: "8",
                },
            ],
        });
    });

    test("tolerates a missing guild", () => {
        const [ranking] = trim({
            ...rawCharacterRankings,
            rankings: [{ ...rawRanking, guild: null }],
        }).rankings;

        expect(ranking.guild).toBeNull();
    });

    test("tolerates missing talents and gear", () => {
        const [ranking] = trim({
            ...rawCharacterRankings,
            rankings: [{ ...rawRanking, talents: undefined, gear: undefined }],
        }).rankings;

        expect(ranking.talents).toEqual([]);
        expect(ranking.gear).toEqual([]);
    });

    test("leaves gear without gems alone", () => {
        const [ranking] = trim({
            ...rawCharacterRankings,
            rankings: [
                {
                    ...rawRanking,
                    gear: [{ ...rawRanking.gear[0], gems: undefined }],
                },
            ],
        }).rankings;

        expect(ranking.gear[0].gems).toBeUndefined();
    });

    test("shrinks the payload", () => {
        const before = JSON.stringify(rawCharacterRankings).length;
        const after = JSON.stringify(trim(rawCharacterRankings)).length;

        expect(after).toBeLessThan(before);
    });
});
