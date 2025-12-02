import { type Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ClassPickers from "^/components/ClassPickers";
import { ErrorView } from "^/components/Error";
import ItemPicker from "^/components/ItemPicker/ItemPicker";
import Rankings from "^/components/Rankings";
import TalentPicker from "^/components/TalentPicker";
import ZonePickers from "^/components/ZonePickers";
import { parseParams, type RawParams } from "^/lib/Params";
import { generateCanonicalUrl } from "^/lib/seo-utils";
import { isNotNull } from "^/lib/utils";
import { getClasses } from "^/lib/wcl/classes";
import { getZones } from "^/lib/wcl/zones";

interface HomeProps {
    searchParams: Promise<RawParams>;
}

export async function generateMetadata(props: HomeProps): Promise<Metadata> {
    const searchParams = await props.searchParams;

    try {
        const { encounter, classId, specId, talents } =
            parseParams(searchParams);

        const canonical = generateCanonicalUrl(searchParams);

        const metadata = {
            alternates: {
                canonical,
            },
        };

        if (!encounter) {
            return {
                ...metadata,
                title: "Search | Warcraftlogs Search",
            };
        }

        const [encounters, classes] = await Promise.all([
            getZones(),
            getClasses(),
        ]);

        const talentNames = talents
            .map(({ name, talentId }) => name ?? talentId)
            .filter(isNotNull)
            .map((t) => t.trim())
            .filter((t) => t.length > 0)
            .join("+");

        const klass =
            classId != null ? classes.find((c) => c.id === classId) : null;
        const spec =
            specId != null ? klass?.specs.find((s) => s.id === specId) : null;

        const encounterName = encounters
            .find((z) => z.encounters.some((e) => e.id === encounter))
            ?.encounters.find((e) => e.id === encounter)?.name;

        const title = [talentNames, spec?.name, klass?.name, encounterName]
            .filter(isNotNull)
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
            .join(" - ");

        return {
            ...metadata,
            title: `${title} Results | Warcraftlogs Search`,
        };
    } catch (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        e: any
    ) {
        const isParameterError: boolean =
            e?.message.includes("Invalid parameter") ||
            e?.message.includes("Malformed parameter");

        return {
            robots: isParameterError ? "noindex, nofollow" : "index, follow",
            title: `${isParameterError ? "400 | Bad Request" : "500 | Error"} | Warcraftlogs Search`,
        };
    }
}

export default async function Home(props: HomeProps) {
    const searchParams = await props.searchParams;

    let parsedParams: ReturnType<typeof parseParams>;
    try {
        parsedParams = parseParams(searchParams);
    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : typeof error === "string"
                  ? error
                  : "";

        const isParameterError =
            message.includes("Invalid parameter") ||
            message.includes("Malformed parameter");

        return <ErrorView isParameterError={isParameterError} />;
    }

    const {
        classId,
        specId,
        encounter,
        difficulty,
        partition,
        metric,
        pages,
        region,
        talents,
        itemFilters,
    } = parsedParams;

    return (
        <>
            <ZonePickers className="mb-4 flex space-x-2 px-8" />
            <ClassPickers className="mb-4 flex space-x-2 px-8" />
            <TalentPicker
                className="mb-4 flex items-start space-x-2 px-8"
                classId={classId}
                specId={specId}
            />
            <ItemPicker
                className="mb-4 flex items-start space-x-2 px-8"
                itemFilters={itemFilters}
            />
            <Suspense
                fallback={
                    <div className="flex justify-center p-8">Loading...</div>
                }
                key={JSON.stringify(searchParams)}
            >
                {encounter != null && (
                    <Rankings
                        className="px-8"
                        region={region}
                        encounter={encounter}
                        difficulty={difficulty}
                        partition={partition}
                        metric={metric}
                        klass={classId}
                        spec={specId}
                        talents={talents}
                        itemFilters={itemFilters}
                        pages={pages}
                    />
                )}
            </Suspense>
            {(() => {
                const canonicalUrl = generateCanonicalUrl(searchParams);

                return (
                    <footer className="mt-8 p-4 text-center text-sm text-gray-500">
                        <div>
                            Canonical:{" "}
                            <Link
                                className="break-all text-blue-500"
                                href={canonicalUrl}
                                rel="alternate"
                            >
                                {canonicalUrl}
                            </Link>
                        </div>
                        <div>
                            Built by{" "}
                            <a
                                href="https://discordapp.com/users/141461759474139136"
                                target="_blank"
                                rel="noopener nofollow"
                                className="text-blue-500"
                            >
                                nullDozzer
                            </a>
                            , powered by the{" "}
                            <a
                                href="https://www.warcraftlogs.com/"
                                target="_blank"
                                rel="noopener nofollow"
                                className="text-blue-500"
                            >
                                Warcraftlogs API
                            </a>
                        </div>
                    </footer>
                );
            })()}
        </>
    );
}
