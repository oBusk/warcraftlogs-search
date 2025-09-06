"use client";

import { useRouter } from "next/navigation";

interface ResetButtonProps {
    children: React.ReactNode;
    className?: string;
}

export default function ResetButton({ children, className }: ResetButtonProps) {
    const router = useRouter();

    const handleReset = () => {
        router.push("/");
    };

    return (
        <button onClick={handleReset} className={className}>
            {children}
        </button>
    );
}
