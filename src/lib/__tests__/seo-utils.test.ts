import { generateCanonicalUrl, shouldNoIndex } from "../seo-utils";

describe("SEO utils", () => {
    describe("shouldNoIndex", () => {
        it("returns false when no pages parameter is present", () => {
            const searchParams = {
                zone: "39",
                encounter: "62662",
            };
            expect(shouldNoIndex(searchParams)).toBe(false);
        });

        it("returns true when pages parameter is present", () => {
            const searchParams = {
                zone: "39",
                encounter: "62662",
                pages: "2,3,4",
            };
            expect(shouldNoIndex(searchParams)).toBe(true);
        });

        it("returns true when pages parameter is present as array", () => {
            const searchParams = {
                zone: "39",
                encounter: "62662",
                pages: ["2", "3", "4"],
            };
            expect(shouldNoIndex(searchParams)).toBe(true);
        });
    });

    describe("generateCanonicalUrl", () => {
        it("generates canonical URL with default base URL", () => {
            const searchParams = {
                zone: "39",
                encounter: "62662",
            };
            const result = generateCanonicalUrl(searchParams);
            expect(result).toBe(
                "https://wcl.nulldozzer.io/?zone=39&encounter=62662",
            );
        });

        it("generates canonical URL with custom base URL", () => {
            const searchParams = {
                zone: "39",
                encounter: "62662",
            };
            const result = generateCanonicalUrl(
                searchParams,
                "https://example.com",
            );
            expect(result).toBe("https://example.com/?zone=39&encounter=62662");
        });

        it("removes pagination parameter from canonical URL", () => {
            const searchParams = {
                zone: "39",
                encounter: "62662",
                page: "2,3,4",
            };
            const result = generateCanonicalUrl(searchParams);
            expect(result).toBe(
                "https://wcl.nulldozzer.io/?zone=39&encounter=62662",
            );
        });

        it("removes pagination parameter when passed as array", () => {
            const searchParams = {
                zone: "39",
                encounter: "62662",
                page: ["2", "3", "4"],
            };
            const result = generateCanonicalUrl(searchParams);
            expect(result).toBe(
                "https://wcl.nulldozzer.io/?zone=39&encounter=62662",
            );
        });

        it("omits default parameter values", () => {
            const searchParams = {
                zone: "42", // default zone
                encounter: "3009", // default encounter
                difficulty: "5", // default difficulty
                metric: "dps", // default metric
            };
            const result = generateCanonicalUrl(searchParams);
            // Should result in empty query string since all are defaults
            expect(result).toBe("https://wcl.nulldozzer.io/");
        });

        it("includes non-default parameter values", () => {
            const searchParams = {
                zone: "39", // non-default
                encounter: "62662", // non-default
                difficulty: "1", // non-default
                partition: "2", // non-default (default is null)
            };
            const result = generateCanonicalUrl(searchParams);
            expect(result).toBe(
                "https://wcl.nulldozzer.io/?zone=39&encounter=62662&difficulty=1&partition=2",
            );
        });

        it("normalizes parameter order consistently", () => {
            // Test that parameter order in input doesn't affect output
            const searchParams1 = {
                encounter: "62662",
                zone: "39",
                partition: "2",
                difficulty: "1",
            };
            const searchParams2 = {
                zone: "39",
                encounter: "62662",
                difficulty: "1",
                partition: "2",
            };

            const result1 = generateCanonicalUrl(searchParams1);
            const result2 = generateCanonicalUrl(searchParams2);

            expect(result1).toBe(result2);
            expect(result1).toBe(
                "https://wcl.nulldozzer.io/?zone=39&encounter=62662&difficulty=1&partition=2",
            );
        });

        it("handles mixed default and non-default parameters", () => {
            const searchParams = {
                zone: "39", // non-default
                encounter: "3009", // default
                difficulty: "1", // non-default
                metric: "dps", // default
                partition: "2", // non-default
            };
            const result = generateCanonicalUrl(searchParams);
            // Should only include non-default parameters
            expect(result).toBe(
                "https://wcl.nulldozzer.io/?zone=39&difficulty=1&partition=2",
            );
        });

        it("handles class and spec parameters", () => {
            const searchParams = {
                zone: "39",
                encounter: "62662",
                class: "1", // non-default (default is null)
                spec: "250", // non-default (default is null)
            };
            const result = generateCanonicalUrl(searchParams);
            expect(result).toBe(
                "https://wcl.nulldozzer.io/?zone=39&encounter=62662&class=1&spec=250",
            );
        });

        it("handles complex JSON parameters like talents and items", () => {
            const searchParams = {
                zone: "39",
                encounter: "62662",
                talents: JSON.stringify([
                    { talentId: "123", name: "Test Talent" },
                ]),
                items: JSON.stringify([{ itemId: "456", name: "Test Item" }]),
            };
            const result = generateCanonicalUrl(searchParams);
            // These should be included since they're non-default (default is empty array)
            expect(result).toContain("zone=39");
            expect(result).toContain("encounter=62662");
            expect(result).toContain("talents=");
            expect(result).toContain("items=");
        });

        it("produces same result for equivalent URLs from the issue", () => {
            // Test the specific URLs mentioned in the GitHub issue
            const url1Params = {
                zone: "39",
                encounter: "62662",
                difficulty: "1",
                partition: "2",
            };

            // Same params but different order
            const url1ParamsReordered = {
                encounter: "62662",
                partition: "2",
                zone: "39",
                difficulty: "1",
            };

            const result1 = generateCanonicalUrl(url1Params);
            const result2 = generateCanonicalUrl(url1ParamsReordered);

            expect(result1).toBe(result2);
            expect(result1).toBe(
                "https://wcl.nulldozzer.io/?zone=39&encounter=62662&difficulty=1&partition=2",
            );
        });

        it("handles undefined and null values", () => {
            const searchParams = {
                zone: "39",
                encounter: "62662",
                difficulty: undefined,
                partition: undefined,
            };
            const result = generateCanonicalUrl(searchParams);
            expect(result).toBe(
                "https://wcl.nulldozzer.io/?zone=39&encounter=62662",
            );
        });
    });
});
