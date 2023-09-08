import type { Metadata } from "next";
import Link from "next/link";
import ClassPickers from "^/components/ClassPickers";
import TalentPicker from "^/components/TalentPicker";
import ZonePickers from "^/components/ZonePickers";
import "./globals.css";

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
            <body>
                <header className="flex p-4 space-x-2 justify-center">
                    <Link href="/">
                        <h1 className="text-4xl font-semibold">
                            wcl.nulldozzer.io
                        </h1>
                    </Link>
                </header>
                {children}
            </body>
        </html>
    );
}
