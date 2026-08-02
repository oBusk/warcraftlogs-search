import { parseParams, toParams } from "../Params";
import { isIndexable, removeNonCanonicalParams } from "../seo-utils";

const parse = (params: Record<string, string> = {}) =>
    parseParams(new URLSearchParams(params));

describe("removeNonCanonicalParams", () => {
    test("removes the page number", () => {
        const sp = toParams(parse({ page: "2" }), { pruneDefaults: false });

        removeNonCanonicalParams(sp);

        expect(sp.has("page")).toBe(false);
    });

    test("keeps the params that define the page", () => {
        const sp = toParams(
            parse({
                region: "US",
                zone: "46",
                encounter: "3176",
                difficulty: "5",
                partition: "1",
                metric: "hps",
                classId: "5",
                specId: "258",
                page: "2",
                talents: JSON.stringify([{ name: "a", talentId: "b" }]),
                itemFilters: JSON.stringify([{ id: "1" }]),
            }),
            { pruneDefaults: false },
        );

        removeNonCanonicalParams(sp);

        expect(sp.has("page")).toBe(false);
        expect(sp.get("region")).toBe("US");
        expect(sp.get("partition")).toBe("1");
        expect(sp.get("classId")).toBe("5");
        expect(sp.get("specId")).toBe("258");
        expect(sp.has("talents")).toBe(true);
        expect(sp.has("itemFilters")).toBe(true);
    });
});

describe("isIndexable", () => {
    test("bare page is indexable", () => {
        expect(isIndexable(parse())).toBe(true);
    });

    test.each([
        ["zone", { zone: "44" }],
        ["encounter", { encounter: "3177" }],
        ["difficulty", { difficulty: "4" }],
    ])("%s stays indexable", (_name, params) => {
        expect(isIndexable(parse(params))).toBe(true);
    });

    test.each([
        ["region", { region: "US" }],
        ["metric", { metric: "hps" }],
        ["classId", { classId: "5" }],
        ["specId", { specId: "258" }],
        ["partition", { partition: "1" }],
        ["page", { page: "2" }],
        ["talents", { talents: JSON.stringify([{ name: "a" }]) }],
        ["itemFilters", { itemFilters: JSON.stringify([{ id: "1" }]) }],
    ])("%s makes the page non-indexable", (_name, params) => {
        expect(isIndexable(parse(params))).toBe(false);
    });

    test("default page number stays indexable", () => {
        expect(isIndexable(parse({ page: "1" }))).toBe(true);
    });

    test("empty filter arrays stay indexable", () => {
        expect(isIndexable(parse({ talents: "[]", itemFilters: "[]" }))).toBe(
            true,
        );
    });

    test("an indexable param alongside a non-indexable one is not indexable", () => {
        expect(isIndexable(parse({ zone: "44", classId: "5" }))).toBe(false);
    });
});
