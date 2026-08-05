export interface ControlsSkeletonProps {
    className?: string;
    controls: number;
}

export default function ControlsSkeleton({
    className,
    controls,
}: ControlsSkeletonProps) {
    return (
        <div className={className} aria-hidden>
            {Array.from({ length: controls }, (_, control) => (
                <span
                    key={control}
                    className="h-10 w-28 animate-pulse rounded-md bg-zinc-800"
                />
            ))}
        </div>
    );
}
