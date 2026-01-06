import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { type RawParams } from "^/lib/Params";
import { generateCanonicalUrl } from "^/lib/seo-utils";

export interface CanonicalFooterProps extends React.HTMLAttributes<HTMLElement> {
    rawParams: Promise<RawParams> | RawParams;
}

export default async function CanonicalFooter({
    rawParams,
    className,
    ...props
}: CanonicalFooterProps) {
    const searchParams = await rawParams;

    const canonicalUrl = generateCanonicalUrl(searchParams);

    return (
        <footer
            className={twMerge(
                "mt-8 p-4 text-center text-sm text-gray-500",
                className,
            )}
            {...props}
        >
            Canonical:{" "}
            <Link
                className="break-all text-blue-500"
                href={canonicalUrl}
                rel="alternate"
            >
                {canonicalUrl}
            </Link>
        </footer>
    );
}
