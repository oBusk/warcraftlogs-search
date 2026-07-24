import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CanonicalFooter from "^/components/CanonicalFooter";
import ClassPickers from "^/components/ClassPickers";
import ItemPicker, {
    ItemPickerFallback,
} from "^/components/ItemPicker/ItemPicker";
import Rankings, { RankingsFallback } from "^/components/Rankings";
import RankingsBoundary from "^/components/RankingsBoundary";
import TalentPicker from "^/components/TalentPicker";
import { TalentPickerFallback } from "^/components/TalentPicker/TalentPicker";
import ZonePickers from "^/components/ZonePickers";
import { isNotFoundError, MalformedUrlParameterError } from "^/lib/Errors";
import { parseParams, type RawParams } from "^/lib/Params";
import { generateCanonicalUrl, isIndexable } from "^/lib/seo-utils";
import { isNotNull } from "^/lib/utils";
import { getClasses } from "^/lib/wcl/classes";
import getRankings from "^/lib/wcl/rankings";
import { getZones } from "^/lib/wcl/zones";

interface HomeProps {
    searchParams: Promise<RawParams>;
}

export async function generateMetadata(props: HomeProps): Promise<Metadata> {
    const searchParams = await props.searchParams;

    try {
        const parsedParams = parseParams(searchParams);
        const {
            classId,
            specId,
            zone,
            encounter,
            difficulty,
            metric,
            pages,
            partition,
            region,
            talents,
            itemFilters,
        } = parsedParams;

        const canonical = generateCanonicalUrl(searchParams);

        const metadata: Metadata = {
            alternates: {
                canonical,
            },
            ...(!isIndexable(parsedParams) && {
                robots: {
                    index: false,
                    follow: true,
                },
            }),
        };

        if (!encounter) {
            return {
                ...metadata,
                title: "Search | Warcraftlogs Search",
            };
        }

        const zones = await getZones();

        if (!zones.some((z) => z.id === zone)) {
            throw new MalformedUrlParameterError(`Zone ${zone} not found`);
        }

        const [classes, { filteredCount }] = await Promise.all([
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

        const encounterName = zones
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
        if (isNotFoundError(e)) {
            notFound();
        }

        return {
            robots: {
                index: false,
                follow: true,
            },
            title: "500 | Error | Warcraftlogs Search",
        };
    }
}

export default async function Home(props: HomeProps) {
    return (
        <>
            <Suspense
                fallback={
                    <div
                        className="mb-4 h-[37px]"
                        aria-busy="true"
                        aria-label="Loading zone pickers"
                    ></div>
                }
            >
                <ZonePickers className="mb-4 flex space-x-2 px-8" />
            </Suspense>
            <Suspense
                fallback={
                    <div
                        className="mb-4 h-[37px]"
                        aria-busy="true"
                        aria-label="Loading class pickers"
                    ></div>
                }
            >
                <ClassPickers className="mb-4 flex space-x-2 px-8" />
            </Suspense>
            <Suspense
                fallback={
                    <TalentPickerFallback className="mb-4 flex items-start space-x-2 px-8" />
                }
            >
                <TalentPicker
                    className="mb-4 flex items-start space-x-2 px-8"
                    rawParams={props.searchParams}
                />
            </Suspense>
            <Suspense
                fallback={
                    <ItemPickerFallback className="mb-4 flex items-start space-x-2 px-8" />
                }
            >
                <ItemPicker className="mb-4 flex items-start space-x-2 px-8" />
            </Suspense>
            <RankingsBoundary fallback={<RankingsFallback className="px-8" />}>
                <Rankings className="px-8" rawParams={props.searchParams} />
            </RankingsBoundary>
            <Suspense>
                <CanonicalFooter
                    rawParams={props.searchParams}
                    className="mt-8"
                />
            </Suspense>
        </>
    );
}
