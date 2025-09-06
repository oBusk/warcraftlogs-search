import { parseParams, toParams } from "../Params";

describe("Params utils", () => {
    test("parseParams returns defaults when params missing", () => {
        const parsed = parseParams(new URLSearchParams());
        expect(parsed).toEqual({
            region: null,
            zone: 40,
            encounter: 3005,
            difficulty: 5,
            partition: null,
            metric: "dps",
            classId: null,
            specId: null,
            pages: [1],
            talents: [],
            itemFilters: [],
        });
    });

    test("toParams and parseParams round trip", () => {
        const params = {
            region: "US",
            zone: 1,
            encounter: 2,
            difficulty: 3,
            partition: 4,
            metric: "hps",
            classId: 5,
            specId: 6,
            pages: [7, 8],
            talents: [{ name: "a", talentId: "b" }],
            itemFilters: [
                {
                    name: "helm",
                    id: "1",
                    permanentEnchant: "2",
                    temporaryEnchant: "3",
                    bonusId: "4",
                    gemId: "5",
                },
            ],
        } as const;

        const sp = toParams(params);
        const roundTripped = parseParams(sp);
        expect(roundTripped).toEqual(params);
    });

    test("toParams omits defaults", () => {
        const sp = toParams(parseParams(new URLSearchParams()));
        expect(sp.toString()).toBe("");
    });
});
