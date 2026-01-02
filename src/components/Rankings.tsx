import { type ComponentProps } from "react";
import { buildWclUrl } from "^/lib/utils";
import { getClasses } from "^/lib/wcl/classes";
import { type NullCharacterRankings } from "^/lib/wcl/rankings";
import PageLinks from "./PageLinks";

export interface RankingsProps extends ComponentProps<"div"> {
    characterRankings: NullCharacterRankings;
}

export default async function Rankings({
    characterRankings,
    ...props
}: RankingsProps) {
    const { rankings, count, pages, filteredCount, hasMorePages } =
        characterRankings;

    const classes = await getClasses();

    const classToColor: Record<string, string> = classes.reduce(
        (acc, { slug, color }) => ({ ...acc, [slug]: color }),
        {},
    );

    return (
        <div {...props}>
            {count != null && (
                <>
                    <p className="mb-2 text-center text-xl font-bold">
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
                            <th className="text-left">Date</th>
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
                                report: { code, fightID, startTime },
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
                                            rel="noopener"
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
                                            {new Date(
                                                startTime,
                                            ).toLocaleDateString()}
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
