"use client";

import ResetButton from "^/components/ResetButton";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error }: ErrorProps) {
    // Check if this is a parameter validation error
    const isParameterError =
        error.message.includes("Invalid parameter") ||
        error.message.includes("Malformed parameter");

    if (isParameterError) {
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
                    <ResetButton className="inline-block rounded bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700">
                        Reset
                    </ResetButton>
                </div>
            </div>
        );
    }

    // For other errors, show a generic error page
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-6 px-8">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-400">500</h1>
                <h2 className="mt-4 text-2xl font-semibold">
                    Something went wrong
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    An unexpected error occurred.
                </p>
            </div>
            <div className="text-center">
                <ResetButton className="inline-block rounded bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700">
                    Reset
                </ResetButton>
            </div>
        </div>
    );
}
