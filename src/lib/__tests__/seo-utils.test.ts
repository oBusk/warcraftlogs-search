import { generateCanonicalUrl } from "../seo-utils";

describe("SEO utils", () => {
    describe("generateCanonicalUrl", () => {
        test("removes pages parameter", () => {
            const parsed = {
                zone: 44,
                encounter: 3129,
                difficulty: 5,
                partition: null,
                metric: "dps",
                region: null,
                classId: null,
                specId: null,
                pages: [1, 2, 3],
                talents: [],
                itemFilters: [],
            };

            const url = generateCanonicalUrl(parsed);
            expect(url).not.toContain("page");
        });

        test("uses default base URL", () => {
            const parsed = {
                zone: 44,
                encounter: 3129,
                difficulty: 5,
                partition: null,
                metric: "dps",
                region: null,
                classId: null,
                specId: null,
                pages: [1],
                talents: [],
                itemFilters: [],
            };

            const url = generateCanonicalUrl(parsed);
            expect(url).toMatch(/^https:\/\/wcl\.nulldozzer\.io/);
        });

        test("uses custom base URL", () => {
            const parsed = {
                zone: 44,
                encounter: 3129,
                difficulty: 5,
                partition: null,
                metric: "dps",
                region: null,
                classId: null,
                specId: null,
                pages: [1],
                talents: [],
                itemFilters: [],
            };

            const url = generateCanonicalUrl(
                parsed,
                "https://example.com/test",
            );
            expect(url).toMatch(/^https:\/\/example\.com\/test/);
        });

        test("handles relative paths correctly", () => {
            const parsed = {
                zone: 1,
                encounter: 2,
                difficulty: 3,
                partition: null,
                metric: "dps",
                region: null,
                classId: null,
                specId: null,
                pages: [1],
                talents: [],
                itemFilters: [],
            };

            const url = generateCanonicalUrl(parsed, ".");
            expect(url).toMatch(/^\?/);
            expect(url).not.toMatch(/^\.\?/);
            expect(url).toContain("zone=1");
            expect(url).toContain("encounter=2");
        });

        test("includes non-default parameters", () => {
            const parsed = {
                zone: 1,
                encounter: 2,
                difficulty: 3,
                partition: 4,
                metric: "hps",
                region: "US",
                classId: 5,
                specId: 6,
                pages: [1],
                talents: [{ name: "test", talentId: "123" }],
                itemFilters: [],
            };

            const url = generateCanonicalUrl(parsed);
            expect(url).toContain("zone=1");
            expect(url).toContain("encounter=2");
            expect(url).toContain("difficulty=3");
            expect(url).toContain("partition=4");
            expect(url).toContain("metric=hps");
            expect(url).toContain("region=US");
            expect(url).toContain("classId=5");
            expect(url).toContain("specId=6");
            expect(url).toContain("talents=");
            expect(url).not.toContain("page");
        });

        test("works with partial params", () => {
            const partial = {
                zone: 1,
                encounter: 2,
            };

            const url = generateCanonicalUrl(
                partial,
                "https://example.com/test",
            );
            expect(url).toContain("zone=1");
            expect(url).toContain("encounter=2");
        });

        test("converts raw params to canonical URL", () => {
            const raw = {
                zone: "1",
                encounter: "2",
                difficulty: "3",
                page: "1,2,3",
            };

            const url = generateCanonicalUrl(raw);
            expect(url).toContain("zone=1");
            expect(url).toContain("encounter=2");
            expect(url).toContain("difficulty=3");
            expect(url).not.toContain("page");
        });

        test("includes default values in canonical URL", () => {
            const raw = {};

            const url = generateCanonicalUrl(raw);
            // Canonical URLs should include all non-null values, including defaults
            expect(url).toContain("zone=44");
            expect(url).toContain("encounter=3129");
            expect(url).toContain("difficulty=5");
            expect(url).toContain("metric=dps");
        });
    });
});
