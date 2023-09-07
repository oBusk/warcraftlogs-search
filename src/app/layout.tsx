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
                        <h1>wcl.nulldozzer.io</h1>
                    </Link>
                </header>
                <ZonePickers className="flex space-x-2 mb-4 px-8" />
                <div className="flex space-x-2 mb-4 px-8">
                    <ClassPickers className="flex space-x-2" />
                    <div className="flex-1" />
                    <TalentPicker />
                </div>
                {children}
            </body>
        </html>
    );
}
