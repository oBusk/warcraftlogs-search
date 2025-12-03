import { parseParams, toParams } from "../Params";

describe("Params utils", () => {
    test("parseParams returns defaults when params missing", () => {
        const parsed = parseParams(new URLSearchParams());
        expect(parsed).toEqual({
            region: null,
            zone: 44,
            encounter: 3129,
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
        const defaultParams = parseParams(new URLSearchParams());
        const sp = toParams(defaultParams);
        expect(sp.toString()).toBe("");
    });

    test("toParams keeps defaults when pruneDefaults is false", () => {
        const defaultParams = parseParams(new URLSearchParams());
        const sp = toParams(defaultParams, { pruneDefaults: false });

        expect(sp.toString()).toBe(
            "zone=44&encounter=3129&difficulty=5&metric=dps&pages=1",
        );
    });

    test("toParams prunes empty arrays regardless of pruneDefaults", () => {
        const params = parseParams(new URLSearchParams());
        params.pages = [];
        params.talents = [];
        params.itemFilters = [];

        const sp = toParams(params, { pruneDefaults: false });

        expect(sp.has("pages")).toBe(false);
        expect(sp.has("talents")).toBe(false);
        expect(sp.has("itemFilters")).toBe(false);
    });

    test("toParams keeps non-empty arrays when provided", () => {
        const params = parseParams(new URLSearchParams());
        params.pages = [2, 3];
        params.talents = [{ name: "a", talentId: "b" }];
        params.itemFilters = [
            {
                name: "helm",
                id: "1",
                permanentEnchant: "2",
                temporaryEnchant: "3",
                bonusId: "4",
                gemId: "5",
            },
        ];

        const sp = toParams(params, { pruneDefaults: false });

        expect(sp.get("pages")).toBe("2,3");
        expect(sp.get("talents")).toBe(
            JSON.stringify([{ name: "a", talentId: "b" }]),
        );
        expect(sp.get("itemFilters")).toBe(
            JSON.stringify([
                {
                    name: "helm",
                    id: "1",
                    permanentEnchant: "2",
                    temporaryEnchant: "3",
                    bonusId: "4",
                    gemId: "5",
                },
            ]),
        );
    });

    test("parseParams throws when number param is invalid", () => {
        expect(() =>
            parseParams(new URLSearchParams({ zone: "not-a-number" })),
        ).toThrow("Malformed parameter: zone is not a valid number");
    });

    test("parseParams throws when number array param is invalid", () => {
        expect(() =>
            parseParams(new URLSearchParams({ pages: "1,a,3" })),
        ).toThrow("Malformed parameter: pages is not a valid number array");
    });

    test("parseParams throws when JSON params are invalid", () => {
        expect(() =>
            parseParams(new URLSearchParams({ talents: "not-json" })),
        ).toThrow("Malformed parameter: talents is not a valid JSON");
    });

    test("parseParams decodes JSON params", () => {
        const filters = [
            {
                name: "test",
                id: "1",
                permanentEnchant: "2",
                temporaryEnchant: "3",
                bonusId: "4",
                gemId: "5",
            },
        ];

        const parsed = parseParams(
            new URLSearchParams({ itemFilters: JSON.stringify(filters) }),
        );

        expect(parsed.itemFilters).toEqual(filters);
    });
});
