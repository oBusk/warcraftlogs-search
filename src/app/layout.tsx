import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "null Warcraftlogs Search",
    description: "Search warcraftlogs by criteria, built by nullDozzer",
    colorScheme: "dark light",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <header className="flex p-4 space-x-2 justify-center">
                    <Link href="/">
                        <h1>wcl.nulldozzer.io</h1>
                    </Link>
                </header>
                {children}
            </body>
        </html>
    );
}
