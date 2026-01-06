import { type Metadata } from "next";
import { Suspense } from "react";
import CanonicalFooter from "^/components/CanonicalFooter";
import ClassPickers from "^/components/ClassPickers";
import ItemPicker from "^/components/ItemPicker/ItemPicker";
import Rankings from "^/components/Rankings";
import TalentPicker from "^/components/TalentPicker";
import ZonePickers from "^/components/ZonePickers";
import { isNotFoundError } from "^/lib/Errors";
import { parseParams, type RawParams } from "^/lib/Params";
import { generateCanonicalUrl } from "^/lib/seo-utils";
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
    return (
        <>
            <Suspense>
                <ZonePickers className="mb-4 flex space-x-2 px-8" />
            </Suspense>
            <Suspense>
                <ClassPickers className="mb-4 flex space-x-2 px-8" />
            </Suspense>
            <Suspense>
                <TalentPicker
                    className="mb-4 flex items-start space-x-2 px-8"
                    rawParams={props.searchParams}
                />
            </Suspense>
            <Suspense>
                <ItemPicker className="mb-4 flex items-start space-x-2 px-8" />
            </Suspense>
            <Suspense fallback={<div>Loading rankings...</div>}>
                <Rankings className="px-8" rawParams={props.searchParams} />
            </Suspense>
            <Suspense>
                <CanonicalFooter
                    rawParams={props.searchParams}
                    className="mt-8"
                />
            </Suspense>
        </>
    );
}
