import { Analytics } from "@vercel/analytics/react";
import { GithubIcon } from "lucide-react";
import {
    Link,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import styles from "./globals.css?url";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
    { rel: "icon", href: "/favicon.ico" },
];

export default function App() {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta name="color-scheme" content="dark" />
                <Meta />
                <Links />
            </head>
            <body>
                <header className="flex items-end space-x-2 p-4">
                    <Link to="/" className="flex items-end gap-1">
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
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <Analytics />
            </body>
        </html>
    );
}
