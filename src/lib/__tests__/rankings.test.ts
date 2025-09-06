import getRankings from "../wcl/rankings";
import { wclFetch } from "../wcl/wclFetch";

// Mock the wclFetch function
jest.mock("../wcl/wclFetch", () => ({
    wclFetch: jest.fn(),
}));
// Mock the getClass function
jest.mock("../wcl/classes", () => ({
    getClass: jest.fn().mockResolvedValue({
        slug: "warrior",
        specs: [{ id: 1, name: "Protection" }],
    }),
}));

const mockedWclFetch = jest.mocked(wclFetch);

describe("getRankings", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("handles null rankings.rankings gracefully", async () => {
        // Mock a response where rankings.rankings is null
        mockedWclFetch.mockResolvedValue({
            worldData: {
                encounter: {
                    characterRankings: {
                        page: 1,
                        hasMorePages: false,
                        count: 0,
                        rankings: null, // This should cause the TypeError
                    },
                },
            },
        });

        const result = await getRankings({
            difficulty: 5,
            encounter: 3009,
            klass: 1,
            pages: [1],
            partition: 1,
            metric: "dps",
            region: "US",
            spec: 1,
            talents: [],
            itemFilters: [],
        });

        // Should not throw and should return empty rankings
        expect(result).toEqual({
            pages: [],
            count: 0,
            filteredCount: 0,
            hasMorePages: true,
            rankings: [],
        });
    });

    test("handles undefined rankings.rankings gracefully", async () => {
        // Mock a response where rankings.rankings is undefined
        mockedWclFetch.mockResolvedValue({
            worldData: {
                encounter: {
                    characterRankings: {
                        page: 1,
                        hasMorePages: false,
                        count: 0,
                        rankings: undefined, // This should also cause the TypeError
                    },
                },
            },
        });

        const result = await getRankings({
            difficulty: 5,
            encounter: 3009,
            klass: 1,
            pages: [1],
            partition: 1,
            metric: "dps",
            region: "US",
            spec: 1,
            talents: [],
            itemFilters: [],
        });

        // Should not throw and should return empty rankings
        expect(result).toEqual({
            pages: [],
            count: 0,
            filteredCount: 0,
            hasMorePages: true,
            rankings: [],
        });
    });

    test("handles normal rankings array correctly", async () => {
        const mockRanking = {
            name: "TestPlayer",
            class: "warrior",
            spec: "Protection",
            amount: 1000,
            hardModeLevel: 0,
            duration: 300000,
            startTime: Date.now(),
            report: { code: "ABC123", fightID: 1, startTime: Date.now() },
            guild: { id: 1, name: "TestGuild", faction: 1 },
            server: { id: 1, name: "TestServer", region: "US" },
            bracketData: 0,
            faction: 1,
            talents: [],
            gear: [],
        };

        mockedWclFetch.mockResolvedValue({
            worldData: {
                encounter: {
                    characterRankings: {
                        page: 1,
                        hasMorePages: false,
                        count: 1,
                        rankings: [mockRanking],
                    },
                },
            },
        });

        const result = await getRankings({
            difficulty: 5,
            encounter: 3009,
            klass: 1,
            pages: [1],
            partition: 1,
            metric: "dps",
            region: "US",
            spec: 1,
            talents: [],
            itemFilters: [],
        });

        expect(result).toEqual({
            pages: [1],
            count: 1,
            filteredCount: 1,
            hasMorePages: false,
            rankings: [mockRanking],
        });
    });
});
