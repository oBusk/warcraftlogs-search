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
                "bg-zinc-700 hover:bg-zinc-600 rounded-md p-2",
                className,
            )}
            {...props}
        />
    );
}
