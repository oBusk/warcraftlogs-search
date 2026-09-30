import { buildUrl, resolveFilterNavigation } from "../filterNavigation";

describe("resolveFilterNavigation", () => {
    test("returns null when the selection is unchanged", () => {
        const current = new URLSearchParams({ classId: "5", page: "3" });

        expect(resolveFilterNavigation(current, { classId: 5 })).toBeNull();
    });

    test("returns null when a page control targets the current page", () => {
        const current = new URLSearchParams({ page: "3" });

        expect(resolveFilterNavigation(current, { page: 3 })).toBeNull();
    });

    test("drops the page when a filter changes", () => {
        const current = new URLSearchParams({ classId: "5", page: "3" });
        const url = resolveFilterNavigation(current, { classId: 7 });

        expect(new URL(url!, "https://x/").searchParams.get("page")).toBeNull();
        expect(new URL(url!, "https://x/").searchParams.get("classId")).toBe(
            "7",
        );
    });

    test("drops the page when a filter is cleared", () => {
        const current = new URLSearchParams({ classId: "5", page: "3" });
        const url = resolveFilterNavigation(current, { classId: null });

        expect(new URL(url!, "https://x/").searchParams.get("page")).toBeNull();
    });

    test("drops the page when a talent filter changes", () => {
        const current = new URLSearchParams({ page: "4" });
        const url = resolveFilterNavigation(current, {
            talents: [{ name: "Avenging Wrath", talentId: "" }],
        });

        expect(new URL(url!, "https://x/").searchParams.get("page")).toBeNull();
    });

    test("keeps the requested page when paging", () => {
        const current = new URLSearchParams({ classId: "5", page: "3" });
        const url = resolveFilterNavigation(current, { page: 4 });

        expect(new URL(url!, "https://x/").searchParams.get("page")).toBe("4");
        expect(new URL(url!, "https://x/").searchParams.get("classId")).toBe(
            "5",
        );
    });
});

describe("buildUrl", () => {
    test("omits params that match their default", () => {
        const url = buildUrl(new URLSearchParams(), { page: 1, metric: "dps" });

        expect(url).toBe(".");
    });

    test("canonical urls drop the page", () => {
        const url = buildUrl(
            new URLSearchParams({ page: "3" }),
            { zone: 46 },
            { canonical: true },
        );

        expect(new URL(url, "https://x/").searchParams.get("page")).toBeNull();
    });
});
