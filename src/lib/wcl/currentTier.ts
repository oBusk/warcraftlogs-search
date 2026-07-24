import type { Zone } from "./zones";

/**
 * Pure helpers for resolving the "current" raid tier from a Warcraft Logs zone
 * list. Kept free of server-only imports so both server components and client
 * pickers can use them.
 */

/** Warcraft Logs difficulty id for Mythic raids. Constant across expansions. */
export const MYTHIC_DIFFICULTY_ID = 5;

/**
 * The raid tier to select by default: the most recent raid of the current
 * expansion. Raids are identified by offering a Mythic difficulty, which
 * excludes Mythic+/PvP zones; among those the most recent has the highest id.
 * Falls back to the newest zone that has encounters when no raid is found
 * (e.g. a fresh expansion before its first raid opens).
 */
export function getDefaultZone(zones: Zone[]): Zone | undefined {
    const raids = zones.filter((zone) =>
        zone.difficulties.some(({ id }) => id === MYTHIC_DIFFICULTY_ID),
    );

    const candidates =
        raids.length > 0
            ? raids
            : zones.filter((zone) => zone.encounters.length > 0);

    return candidates.reduce<Zone | undefined>(
        (latest, zone) =>
            latest == null || zone.id > latest.id ? zone : latest,
        undefined,
    );
}

/**
 * Resolves the default zone/encounter/difficulty from the given zones, used
 * when the corresponding URL params are absent. Empty when there are no zones.
 */
export function getDefaultSelection(zones: Zone[]): {
    zone?: number;
    encounter?: number;
    difficulty?: number;
} {
    const zone = getDefaultZone(zones);

    if (zone == null) {
        return {};
    }

    return {
        zone: zone.id,
        encounter: zone.encounters[0]?.id,
        difficulty: zone.difficulties.some(
            ({ id }) => id === MYTHIC_DIFFICULTY_ID,
        )
            ? MYTHIC_DIFFICULTY_ID
            : zone.difficulties[0]?.id,
    };
}
