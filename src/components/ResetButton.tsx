"use client";

interface ResetButtonProps {
    children: React.ReactNode;
    className?: string;
}

export default function ResetButton({ children, className }: ResetButtonProps) {
    const handleReset = () => {
        // Force a full page reload to ensure we get a fresh page without any cached state
        window.location.href = "/";
    };

    return (
        <button onClick={handleReset} className={className}>
            {children}
        </button>
    );
}
