"use client";

import { ErrorView } from "^/components/Error";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error }: ErrorProps) {
    // Check if this is a parameter validation error
    const isParameterError =
        error.message.includes("Invalid parameter") ||
        error.message.includes("Malformed parameter");

    return <ErrorView isParameterError={isParameterError} />;
}
