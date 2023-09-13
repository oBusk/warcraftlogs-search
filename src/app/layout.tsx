import { GithubIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        template: "%s | wcl.nulldozzer.io",
        default: "wcl.nulldozzer.io",
    },
    description: "Search warcraftlogs by criteria, built by nullDozzer",
    colorScheme: "dark",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <header className="flex p-4 space-x-2 justify-between items-center">
                    <div />
                    <Link href="/">
                        <h1 className="text-4xl font-semibold">
                            wcl.nulldozzer.io
                        </h1>
                    </Link>
                    <a
                        href="https://github.com/oBusk/warcraftlogs-search"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <GithubIcon />
                    </a>
                </header>
                {children}
            </body>
        </html>
    );
}
