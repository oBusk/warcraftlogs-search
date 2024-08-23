import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export default function Button({
    className,
    ...props
}: ComponentProps<"button">) {
    return (
        <button
            type="button"
            className={twMerge(
                "rounded-md bg-zinc-700 p-2 hover:bg-zinc-600",
                className,
            )}
            {...props}
        />
    );
}
