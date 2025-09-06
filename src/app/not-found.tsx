import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-6 px-8">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-400">404</h1>
                <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    The zone, encounter, or other parameters you&apos;re looking
                    for don&apos;t exist or are invalid.
                </p>
            </div>
            <div className="text-center">
                <Link
                    href="/"
                    className="inline-block rounded bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
                >
                    Return to Search
                </Link>
            </div>
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p>Common issues:</p>
                <ul className="mt-2 space-y-1">
                    <li>• Invalid encounter ID</li>
                    <li>• Zone that doesn&apos;t exist</li>
                    <li>• Outdated or incorrect URL parameters</li>
                </ul>
            </div>
        </div>
    );
}
