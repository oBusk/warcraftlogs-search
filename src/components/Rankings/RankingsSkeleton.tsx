import {
    MIN_RESULTS_HEIGHT,
    RANKINGS_COLUMNS,
    ROW_HEIGHT,
    SKELETON_ROWS,
} from "./layout";

export default function RankingsSkeleton() {
    return (
        <div role="status" aria-label="Loading results">
            <div aria-hidden className={MIN_RESULTS_HEIGHT}>
                <table className="w-full">
                    <thead>
                        <tr className={ROW_HEIGHT}>
                            {RANKINGS_COLUMNS.map(({ label, align }) => (
                                <th key={label} className={`py-0.5 ${align}`}>
                                    {label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="animate-pulse">
                        {Array.from({ length: SKELETON_ROWS }, (_, row) => (
                            <tr key={row} className={ROW_HEIGHT}>
                                {RANKINGS_COLUMNS.map(({ label }) => (
                                    <td key={label} className="py-0.5 pr-4">
                                        <span className="block h-3 rounded bg-zinc-800" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
