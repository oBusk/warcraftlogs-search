import { Suspense } from "react";
import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ClassPickers from "^/components/ClassPickers";
import { ErrorView } from "^/components/Error";
import ItemPicker from "^/components/ItemPicker/ItemPicker";
import Rankings from "^/components/Rankings";
import TalentPicker from "^/components/TalentPicker";
import ZonePickers from "^/components/ZonePickers";
import { parseParams, type RawParams } from "^/lib/Params";
import { generateCanonicalUrl, shouldNoIndex } from "^/lib/seo-utils";
import { isNotNull } from "^/lib/utils";
import { getClasses } from "^/lib/wcl/classes";
import { getRegions } from "^/lib/wcl/regions";
import { getZones } from "^/lib/wcl/zones";

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
    const searchParams = new URLSearchParams(location.search);
    const rawParams: RawParams = Object.fromEntries(searchParams);

    if (!data || data.error) {
        const isParameterError = data?.isParameterError ?? false;
        return [
            { title: `${isParameterError ? "400 | Bad Request" : "500 | Error"} | Warcraftlogs Search` },
            { name: "robots", content: isParameterError ? "noindex, nofollow" : "index, follow" },
        ];
    }

    try {
        const { encounter, classId, specId, talents } = parseParams(rawParams);
        const shouldBlock = shouldNoIndex(rawParams);
        const canonical = generateCanonicalUrl(rawParams);

        const meta: Array<{ title?: string; name?: string; content?: string; tagName?: string; rel?: string; href?: string }> = [
            { name: "robots", content: shouldBlock ? "noindex, nofollow" : "index, follow" },
        ];

        if (canonical) {
            meta.push({ tagName: "link", rel: "canonical", href: canonical });
        }

        if (!encounter) {
            meta.unshift({ title: "Search | Warcraftlogs Search" });
            return meta;
        }

        const talentNames = talents
            .map(({ name, talentId }) => name ?? talentId)
            .filter(isNotNull)
            .map((t) => t.trim())
            .filter((t) => t.length > 0)
            .join("+");

        const klass = classId != null && data.classes 
            ? data.classes.find((c) => c.id === classId) 
            : null;
        const spec = specId != null && klass 
            ? klass.specs.find((s) => s.id === specId) 
            : null;

        const encounterName = data.zones
            .find((z) => z.encounters.some((e) => e.id === encounter))
            ?.encounters.find((e) => e.id === encounter)?.name;

        const title = [talentNames, spec?.name, klass?.name, encounterName]
            .filter(isNotNull)
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
            .join(" - ");

        meta.unshift({ title: `${title} Results | Warcraftlogs Search` });
        return meta;
    } catch {
        return [
            { title: "Warcraftlogs Search" },
            { name: "robots", content: "index, follow" },
        ];
    }
};

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const rawParams: RawParams = Object.fromEntries(url.searchParams);

    try {
        const parsedParams = parseParams(rawParams);
        const [zones, classes, regions] = await Promise.all([
            getZones(),
            getClasses(),
            getRegions(),
        ]);

        return json({
            parsedParams,
            zones,
            classes,
            regions,
            searchParams: rawParams,
        });
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

        return json({
            error: message,
            isParameterError,
        }, { status: isParameterError ? 400 : 500 });
    }
}

export default function Index() {
    const data = useLoaderData<typeof loader>();

    if ("error" in data) {
        return <ErrorView isParameterError={data.isParameterError} />;
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
    } = data.parsedParams;

    return (
        <>
            <ZonePickers 
                className="mb-4 flex space-x-2 px-8" 
                zones={data.zones}
                regions={data.regions}
            />
            <ClassPickers 
                className="mb-4 flex space-x-2 px-8" 
                classes={data.classes}
            />
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
                key={JSON.stringify(data.searchParams)}
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
                        zones={data.zones}
                        classes={data.classes}
                    />
                )}
            </Suspense>
        </>
    );
}
