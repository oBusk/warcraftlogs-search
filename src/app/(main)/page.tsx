import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ClassPickers from "^/components/ClassPickers";
import ItemPicker from "^/components/ItemPicker/ItemPicker";
import Rankings from "^/components/Rankings";
import TalentPicker from "^/components/TalentPicker";
import ZonePickers from "^/components/ZonePickers";
import { isNotFoundError } from "^/lib/Errors";
import { type ParsedParams, parseParams, type RawParams } from "^/lib/Params";
import { generateCanonicalUrl } from "^/lib/seo-utils";
import { isNotNull } from "^/lib/utils";
import { getClasses } from "^/lib/wcl/classes";
import getRankings, { type NullCharacterRankings } from "^/lib/wcl/rankings";
import { getZones } from "^/lib/wcl/zones";

interface HomeProps {
    searchParams: Promise<RawParams>;
}

export async function generateMetadata(props: HomeProps): Promise<Metadata> {
    const searchParams = await props.searchParams;

    try {
        const {
            classId,
            specId,
            encounter,
            difficulty,
            metric,
            pages,
            partition,
            region,
            talents,
            itemFilters,
        } = parseParams(searchParams);

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

        const [encounters, classes, { filteredCount }] = await Promise.all([
            getZones(),
            getClasses(),
            getRankings({
                difficulty,
                encounter,
                klass: classId,
                pages,
                partition,
                metric,
                region,
                spec: specId,
                talents,
                itemFilters,
            }),
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
            title: `${title} - ${filteredCount} results | Warcraftlogs Search`,
        };
    } catch (e: unknown) {
        const notFoundError = isNotFoundError(e);

        return {
            robots: {
                index: false,
                follow: true,
            },
            title: `${notFoundError ? "404 | Not found" : "500 | Error"} | Warcraftlogs Search`,
        };
    }
}

export default async function Home(props: HomeProps) {
    const searchParams = await props.searchParams;

    let parsedParams: ParsedParams;
    let characterRankings: NullCharacterRankings;
    try {
        parsedParams = parseParams(searchParams);

        characterRankings = await getRankings({
            difficulty: parsedParams.difficulty,
            encounter: parsedParams.encounter,
            klass: parsedParams.classId,
            pages: parsedParams.pages,
            partition: parsedParams.partition,
            metric: parsedParams.metric,
            region: parsedParams.region,
            spec: parsedParams.specId,
            talents: parsedParams.talents,
            itemFilters: parsedParams.itemFilters,
        });
    } catch (error: unknown) {
        if (isNotFoundError(error)) {
            notFound();
        }

        // Re-throw non-parameter errors to be caught by error.tsx
        throw error;
    }

    return (
        <>
            <ZonePickers className="mb-4 flex space-x-2 px-8" />
            <ClassPickers className="mb-4 flex space-x-2 px-8" />
            <TalentPicker
                className="mb-4 flex items-start space-x-2 px-8"
                classId={parsedParams.classId}
                specId={parsedParams.specId}
            />
            <ItemPicker
                className="mb-4 flex items-start space-x-2 px-8"
                itemFilters={parsedParams.itemFilters}
            />
            {parsedParams.encounter != null && (
                <Rankings
                    className="px-8"
                    characterRankings={characterRankings}
                />
            )}
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
