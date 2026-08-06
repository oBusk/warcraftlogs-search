import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CanonicalFooter from "^/components/CanonicalFooter";
import ClassPickers from "^/components/ClassPickers";
import ItemPicker from "^/components/ItemPicker/ItemPicker";
import Rankings, {
    RankingsShell,
    RankingsSkeleton,
} from "^/components/Rankings";
import TalentPicker from "^/components/TalentPicker";
import ZonePickers from "^/components/ZonePickers";
import { isNotFoundError, MalformedUrlParameterError } from "^/lib/Errors";
import { parseParams, type RawParams } from "^/lib/Params";
import { generateCanonicalUrl, isIndexable } from "^/lib/seo-utils";
import { tw } from "^/lib/tw";
import { isNotNull } from "^/lib/utils";
import { getGameData } from "^/lib/wcl/gameData";
import getRankings from "^/lib/wcl/rankings";

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
            page,
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

        const { zones } = await getGameData();

        if (!zones.some((z) => z.id === zone)) {
            throw new MalformedUrlParameterError(`Zone ${zone} not found`);
        }

        const [{ classes }, { filteredCount }] = await Promise.all([
            getGameData(),
            getRankings({
                difficulty,
                encounter,
                klass: classId,
                page,
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

const pickerRow = tw`mb-4 flex gap-2 px-8`;
const filterRow = tw`mb-4 flex items-start gap-2 px-8`;

export default function Home(props: HomeProps) {
    return (
        <>
            <Suspense>
                <ZonePickers className={pickerRow} />
            </Suspense>
            <Suspense>
                <ClassPickers className={pickerRow} />
            </Suspense>
            <Suspense>
                <TalentPicker
                    className={filterRow}
                    rawParams={props.searchParams}
                />
            </Suspense>
            <Suspense>
                <ItemPicker className={filterRow} />
            </Suspense>
            <RankingsShell className="px-8">
                <Suspense fallback={<RankingsSkeleton />}>
                    <Rankings rawParams={props.searchParams} />
                </Suspense>
            </RankingsShell>
            <Suspense>
                <CanonicalFooter
                    rawParams={props.searchParams}
                    className="mt-8"
                />
            </Suspense>
        </>
    );
}
