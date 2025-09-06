import Link from "next/link";

export default function BadRequest() {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-6 px-8">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-400">400</h1>
                <h2 className="mt-4 text-2xl font-semibold">Bad Request</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    The parameters in your URL are malformed or invalid.
                </p>
            </div>
            <div className="text-center">
                <Link
                    href="/"
                    className="inline-block rounded bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
                >
                    Reset
                </Link>
            </div>
        </div>
    );
}
