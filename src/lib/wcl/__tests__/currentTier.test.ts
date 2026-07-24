import { getDefaultSelection, getDefaultZone } from "../currentTier";
import type { Zone } from "../zones";

function makeZone(overrides: Partial<Zone> & Pick<Zone, "id">): Zone {
    return {
        name: `Zone ${overrides.id}`,
        partitions: [{ id: 1, name: "Partition 1" }],
        encounters: [{ id: overrides.id * 10, name: "Boss 1" }],
        difficulties: [
            { id: 3, name: "Normal" },
            { id: 4, name: "Heroic" },
            { id: 5, name: "Mythic" },
        ],
        ...overrides,
    };
}

// A Mythic+ / dungeon zone: no Mythic raid difficulty (id 5).
const mythicPlusZone: Zone = {
    id: 99,
    name: "Mythic+ Season",
    partitions: [{ id: 1, name: "Partition 1" }],
    encounters: [{ id: 990, name: "Dungeon 1" }],
    difficulties: [{ id: 10, name: "Mythic+" }],
};

describe("getDefaultZone", () => {
    test("returns the highest-id raid (has Mythic difficulty)", () => {
        const zones = [
            makeZone({ id: 40 }),
            makeZone({ id: 46 }),
            makeZone({ id: 42 }),
        ];

        expect(getDefaultZone(zones)?.id).toBe(46);
    });

    test("ignores zones without a Mythic difficulty (e.g. Mythic+)", () => {
        // The M+ zone has the highest id but must not win.
        const zones = [makeZone({ id: 46 }), mythicPlusZone];

        expect(getDefaultZone(zones)?.id).toBe(46);
    });

    test("falls back to newest zone with encounters when no raids exist", () => {
        const zones = [
            mythicPlusZone,
            {
                ...mythicPlusZone,
                id: 100,
                encounters: [{ id: 1000, name: "D" }],
            },
        ];

        expect(getDefaultZone(zones)?.id).toBe(100);
    });

    test("returns undefined for an empty zone list", () => {
        expect(getDefaultZone([])).toBeUndefined();
    });
});

describe("getDefaultSelection", () => {
    test("resolves zone, first encounter and Mythic difficulty", () => {
        const zones = [makeZone({ id: 42 }), makeZone({ id: 46 })];

        expect(getDefaultSelection(zones)).toEqual({
            zone: 46,
            encounter: 460,
            difficulty: 5,
        });
    });

    test("uses the first difficulty when the zone has no Mythic", () => {
        const zones = [
            {
                ...mythicPlusZone,
                encounters: [{ id: 990, name: "Dungeon 1" }],
            },
        ];

        expect(getDefaultSelection(zones)).toEqual({
            zone: 99,
            encounter: 990,
            difficulty: 10,
        });
    });

    test("returns an empty object when there are no zones", () => {
        expect(getDefaultSelection([])).toEqual({});
    });
});
