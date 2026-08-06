import { tw } from "^/lib/tw";

export const RESULTS_ID = "rankings";

export const ROW_HEIGHT = tw`h-7`;

/**
 * Matches 10 rows of {@link ROW_HEIGHT} plus the header. Keeps a short page,
 * the empty state and the loading message the same size, so the pagination
 * controls below the table don't move under the pointer.
 */
export const MIN_RESULTS_HEIGHT = tw`min-h-77`;

export const RANKINGS_COLUMNS = [
    { label: "Name", align: tw`text-left` },
    { label: "Date", align: tw`text-left` },
    { label: "Guild", align: tw`text-left` },
    { label: "Class", align: tw`text-left` },
    { label: "Spec", align: tw`text-left` },
    { label: "DPS", align: tw`text-right` },
] as const;
