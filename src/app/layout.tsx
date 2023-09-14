import { DiscordIcon, GithubIcon } from "lucide-react";
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
                <header className="flex p-4 space-x-2 justify-between items-center">
                    <Link href="/" className="flex items-end gap-1">
                        <h1 className="text-4xl font-semibold">
                            Warcraftlogs Search
                        </h1>
                        <small>
                            @nullDozzer on{" "}
                            <a
                                href="https://discord.gg/NwGNKdTk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500"
                            >
                                WoWAnalyzer Discord
                            </a>
                        </small>
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
