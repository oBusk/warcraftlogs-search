/* eslint-disable @next/next/no-html-link-for-pages -- Use native anchor for full-page reset from error view */

export interface ErrorViewProps {
    isNotFound?: boolean;
}

export function ErrorView({ isNotFound = false }: ErrorViewProps) {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-6 px-8">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-400">
                    {isNotFound ? 404 : 500}
                </h1>
                <h2 className="mt-4 text-2xl font-semibold">
                    {isNotFound ? "Not found" : "Something went wrong"}
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {isNotFound
                        ? "The combination of parameters you requested could not be found or is invalid."
                        : "An unexpected error occurred."}
                </p>
            </div>
            <div className="text-center">
                <a
                    href="/"
                    className="inline-block rounded bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
                >
                    Reset
                </a>
            </div>
        </div>
    );
}
