import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { parseParams, type RawParams } from "^/lib/Params";
import getRankings from "^/lib/wcl/rankings";
import { getZones } from "^/lib/wcl/zones";

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const rawParams: RawParams = Object.fromEntries(url.searchParams);

    try {
        const {
            encounter,
            difficulty,
            partition: requestedPartition,
            metric,
            region,
            classId: klass,
            specId: spec,
            talents,
            itemFilters,
            pages: requestedPages,
        } = parseParams(rawParams);

        if (encounter == null) {
            return json({ error: "No encounter specified" }, { status: 400 });
        }

        let partition = requestedPartition;
        if (partition == null) {
            const zones = await getZones();
            const zone = zones.find((z) =>
                z.encounters.some((e) => e.id === encounter),
            );

            if (zone == null) {
                throw new Error(`Zone with encounter ${encounter} not found`);
            }

            partition = zone.partitions[0].id;
        }

        const result = await getRankings({
            difficulty,
            encounter,
            klass,
            pages: requestedPages,
            partition,
            metric,
            region,
            spec,
            talents,
            itemFilters,
        });

        return json(result);
    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : typeof error === "string"
                  ? error
                  : "Unknown error";

        return json({ error: message }, { status: 500 });
    }
}
