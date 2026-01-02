"use client";

import { ErrorView } from "^/components/ErrorView";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error(_props: ErrorProps) {
    return <ErrorView isNotFound={false} />;
}
