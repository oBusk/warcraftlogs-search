export const RESULTS_ID = "rankings";

export const SKELETON_ROWS = 10;

export const ROW_HEIGHT = "h-7";

/**
 * Header plus {@link SKELETON_ROWS} rows at {@link ROW_HEIGHT}. Keeps a short
 * page, the empty state and the skeleton the same size, so the pagination
 * controls below the table don't move under the pointer.
 */
export const MIN_RESULTS_HEIGHT = "min-h-[19.25rem]";

export const RANKINGS_COLUMNS = [
    { label: "Name", align: "text-left" },
    { label: "Date", align: "text-left" },
    { label: "Guild", align: "text-left" },
    { label: "Class", align: "text-left" },
    { label: "Spec", align: "text-left" },
    { label: "DPS", align: "text-right" },
] as const;
