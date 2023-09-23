import { GithubIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        template: "%s | Warcraftlogs Search",
        default: "Warcraftlogs Search",
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
                <header className="flex p-4 space-x-2 items-end">
                    <Link href="/" className="flex items-end gap-1">
                        <h1 className="text-4xl font-semibold">
                            Warcraftlogs Search
                        </h1>
                    </Link>
                    <small>
                        <a
                            href="https://discordapp.com/users/141461759474139136"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500"
                        >
                            nullDozzer
                        </a>{" "}
                        on{" "}
                        <a
                            href="https://discord.gg/NwGNKdTk"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500"
                        >
                            WoWAnalyzer Discord
                        </a>
                    </small>
                    <div className="flex-1" />
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
