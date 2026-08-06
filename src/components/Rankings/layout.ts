export const RESULTS_ID = "rankings";

export const ROW_HEIGHT = "h-7";

/**
 * Matches 10 rows of {@link ROW_HEIGHT} plus the header. Keeps a short page,
 * the empty state and the loading message the same size, so the pagination
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
