import { notFound } from "next/navigation";
import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { isNotFoundError } from "^/lib/Errors";
import { type ParsedParams, parseParams, type RawParams } from "^/lib/Params";
import { buildWclUrl } from "^/lib/utils";
import { getClasses } from "^/lib/wcl/classes";
import getRankings, { type NullCharacterRankings } from "^/lib/wcl/rankings";
import PageLinks from "./PageLinks";

export interface RankingsProps extends ComponentProps<"div"> {
    rawParams: Promise<RawParams> | RawParams;
}

export default async function Rankings({ rawParams, ...props }: RankingsProps) {
    const searchParams = await rawParams;

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

export function RankingsFallback({
    className,
    ...props
}: ComponentProps<"div">) {
    return (
        <div className={twMerge("min-h-64", className)} {...props}>
            <p className="mb-2 text-center text-xl font-bold">
                Loading rankings...
            </p>
        </div>
    );
}
