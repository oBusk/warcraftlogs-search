import { MIN_RESULTS_HEIGHT } from "./layout";

export default function RankingsSkeleton() {
    return (
        <p
            role="status"
            aria-label="Loading results"
            className={`flex items-center justify-center text-lg text-gray-500 ${MIN_RESULTS_HEIGHT}`}
        >
            Loading results…
        </p>
    );
}
