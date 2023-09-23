import { ComponentProps } from "react";
import { buildWclUrl } from "^/lib/utils";
import { getClasses } from "^/lib/wcl/classes";
import getRankings from "^/lib/wcl/rankings";
import { getZones } from "^/lib/wcl/zones";
import { ItemFilterConfig } from "./ItemPicker/ItemFilter";
import PageLinks from "./PageLinks";
import { TalentFilterConfig } from "./TalentPicker/TalentFilter";

export interface RankingsProps extends ComponentProps<"div"> {
    encounter: number;
    region: string | null;
    partition: number | null;
    metric: string;
    difficulty: number;
    klass: number | null;
    spec: number | null;
    talents: TalentFilterConfig[];
    itemFilters: ItemFilterConfig[];
    pages: readonly number[];
}

export default async function Rankings({
    encounter,
    region,
    partition,
    metric,
    difficulty,
    klass,
    spec,
    talents,
    itemFilters,
    pages: requestedPages,
    ...props
}: RankingsProps) {
    if (partition == null) {
        let zones = await getZones();

        const zone = zones.find((z) =>
            z.encounters.some((e) => e.id === encounter),
        );

        if (zone == null) {
            throw new Error(`Zone with encounter ${encounter} not found`);
        }

        // Internally set partition to be first value
        partition = zone.partitions[0].id;
    }

    const [{ rankings, count, pages, filteredCount, hasMorePages }, classes] =
        await Promise.all([
            getRankings({
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
            }),
            getClasses(),
        ]);

    const classToColor: Record<string, string> = classes.reduce(
        (acc, { slug, color }) => ({ ...acc, [slug]: color }),
        {},
    );

    return (
        <div {...props}>
            {count != null && (
                <>
                    <p className="text-xl font-bold mb-2 text-center">
                        Page: {pages.join(",")} - showing {filteredCount} of{" "}
                        {count} results
                    </p>
                    <div className="flex justify-center">
                        <PageLinks showNext={hasMorePages} />
                    </div>
                </>
            )}
            {rankings?.length > 0 ? (
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left">Name</th>
                            <th className="text-left">Guild</th>
                            <th className="text-left">Class</th>
                            <th className="text-left">Spec</th>
                            <th className="text-right">DPS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankings.map(
                            ({
                                name,
                                guild,
                                class: wowClass,
                                spec,
                                amount,
                                report: { code, fightID },
                            }) => {
                                const Cell = ({
                                    children,
                                    ...props
                                }: ComponentProps<"td">) => (
                                    <td {...props}>
                                        <a
                                            href={buildWclUrl({
                                                code,
                                                fightID,
                                            })}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block"
                                        >
                                            {children}
                                        </a>
                                    </td>
                                );

                                const classColor = classToColor[wowClass];

                                return (
                                    <tr
                                        key={code + name}
                                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        <Cell
                                            className="text-left"
                                            style={{
                                                ...(classColor && {
                                                    color: classColor,
                                                }),
                                            }}
                                        >
                                            {name}
                                        </Cell>
                                        <Cell className="text-left">
                                            {guild?.name ?? null}
                                        </Cell>
                                        <Cell className="text-left">
                                            {wowClass}
                                        </Cell>
                                        <Cell className="text-left">
                                            {spec}
                                        </Cell>
                                        <Cell className="text-right font-mono">
                                            {Math.round(
                                                amount,
                                            ).toLocaleString()}
                                        </Cell>
                                    </tr>
                                );
                            },
                        )}
                    </tbody>
                </table>
            ) : (
                <h1>No results</h1>
            )}
        </div>
    );
}
