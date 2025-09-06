// Mock the wclFetch function
jest.mock("^/lib/wcl/wclFetch", () => ({
    wclFetch: jest.fn(),
}));

// Mock the getClass function
jest.mock("^/lib/wcl/classes", () => ({
    getClass: jest.fn(),
}));

import { getClass } from "^/lib/wcl/classes";
import getRankings from "^/lib/wcl/rankings";
import { wclFetch } from "^/lib/wcl/wclFetch";

const mockWclFetch = wclFetch as jest.MockedFunction<typeof wclFetch>;
const mockGetClass = getClass as jest.MockedFunction<typeof getClass>;

describe("getRankings", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Default mock for getClass
        mockGetClass.mockResolvedValue({
            slug: "test-class",
            specs: [{ id: 1, name: "Test Spec" }],
        });
    });

    it("should handle null rankings in API response", async () => {
        // Mock API response where characterRankings.rankings is null
        mockWclFetch.mockResolvedValue({
            worldData: {
                encounter: {
                    characterRankings: {
                        page: 1,
                        hasMorePages: false,
                        count: 0,
                        rankings: null, // This causes the "not iterable" error
                    },
                },
            },
        });

        const result = await getRankings({
            difficulty: 4,
            encounter: 62293,
            klass: 1,
            pages: [1],
            partition: 3,
            metric: "dps",
            region: null,
            spec: null,
            talents: [],
            itemFilters: [],
        });

        expect(result).toEqual({
            pages: [1],
            count: 0,
            filteredCount: 0,
            hasMorePages: false,
            rankings: [],
        });
    });

    it("should handle undefined rankings in API response", async () => {
        // Mock API response where characterRankings.rankings is undefined
        mockWclFetch.mockResolvedValue({
            worldData: {
                encounter: {
                    characterRankings: {
                        page: 1,
                        hasMorePages: false,
                        count: 0,
                        rankings: undefined, // This causes the "not iterable" error
                    },
                },
            },
        });

        const result = await getRankings({
            difficulty: 108,
            encounter: 3012,
            klass: 1,
            pages: [1],
            partition: 5,
            metric: "dps",
            region: null,
            spec: null,
            talents: [],
            itemFilters: [],
        });

        expect(result).toEqual({
            pages: [1],
            count: 0,
            filteredCount: 0,
            hasMorePages: false,
            rankings: [],
        });
    });

    it("should handle valid rankings normally", async () => {
        // Mock API response with valid rankings
        mockWclFetch.mockResolvedValue({
            worldData: {
                encounter: {
                    characterRankings: {
                        page: 1,
                        hasMorePages: false,
                        count: 1,
                        rankings: [
                            {
                                name: "TestPlayer",
                                class: "test-class",
                                spec: "Test Spec",
                                amount: 1000,
                                hardModeLevel: 0,
                                duration: 300,
                                startTime: 1640995200000,
                                report: {
                                    code: "ABC123",
                                    fightID: 1,
                                    startTime: 1640995200000,
                                },
                                guild: {
                                    id: 1,
                                    name: "Test Guild",
                                    faction: 1,
                                },
                                server: {
                                    id: 1,
                                    name: "Test Server",
                                    region: "US",
                                },
                                bracketData: 0,
                                faction: 1,
                                talents: [],
                                gear: [],
                            },
                        ],
                    },
                },
            },
        });

        const result = await getRankings({
            difficulty: 4,
            encounter: 62293,
            klass: 1,
            pages: [1],
            partition: 3,
            metric: "dps",
            region: null,
            spec: null,
            talents: [],
            itemFilters: [],
        });

        expect(result.rankings).toHaveLength(1);
        expect(result.rankings[0].name).toBe("TestPlayer");
        expect(result.count).toBe(1);
    });
});
