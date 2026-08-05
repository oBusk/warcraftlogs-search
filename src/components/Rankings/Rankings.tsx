import { notFound } from "next/navigation";
import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

import { isNotFoundError } from "^/lib/Errors";
import { type ParsedParams, parseParams, type RawParams } from "^/lib/Params";
import { buildWclUrl } from "^/lib/utils";
import { getGameData } from "^/lib/wcl/gameData";
import getRankings, { type NullCharacterRankings } from "^/lib/wcl/rankings";

import { MIN_RESULTS_HEIGHT, RANKINGS_COLUMNS, ROW_HEIGHT } from "./layout";
import PageLinks from "./PageLinks";
import ScrollOnPageChange from "./ScrollOnPageChange";
import StaleRegion from "./StaleRegion";

export interface RankingsProps {
    rawParams: Promise<RawParams> | RawParams;
}

export default async function Rankings({ rawParams }: RankingsProps) {
    const searchParams = await rawParams;

    let parsedParams: ParsedParams;
    let characterRankings: NullCharacterRankings;
    try {
        parsedParams = parseParams(searchParams);

        characterRankings = await getRankings({
            difficulty: parsedParams.difficulty,
            encounter: parsedParams.encounter,
            klass: parsedParams.classId,
            page: parsedParams.page,
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

    const { rankings, count, page, filteredCount, hasMorePages } =
        characterRankings;

    const { classes } = await getGameData();

    const classToColor: Record<string, string> = classes.reduce(
        (acc, { slug, color }) => ({ ...acc, [slug]: color }),
        {},
    );

    return (
        <>
            <ScrollOnPageChange page={page} />
            <p aria-live="polite" className="sr-only">
                {filteredCount === 0
                    ? "No results"
                    : `${filteredCount} results`}
            </p>
            {count != null && (
                <>
                    <StaleRegion>
                        <p className="mb-2 text-center text-xl font-bold">
                            Page: {page} - showing {filteredCount} of {count}{" "}
                            results
                        </p>
                    </StaleRegion>
                    <PageLinks
                        label="Pagination, above results"
                        hasNextPage={hasMorePages}
                    />
                </>
            )}
            <StaleRegion className={twMerge("my-2", MIN_RESULTS_HEIGHT)}>
                {rankings?.length > 0 ? (
                    <table className="w-full">
                        <thead>
                            <tr className={ROW_HEIGHT}>
                                {RANKINGS_COLUMNS.map(({ label, align }) => (
                                    <th
                                        key={label}
                                        scope="col"
                                        className={twMerge("py-0.5", align)}
                                    >
                                        {label}
                                    </th>
                                ))}
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
                                        className,
                                        ...props
                                    }: ComponentProps<"td">) => (
                                        <td
                                            className={twMerge(
                                                "py-0.5",
                                                className,
                                            )}
                                            {...props}
                                        >
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
                                            className={twMerge(
                                                ROW_HEIGHT,
                                                "hover:bg-gray-100 dark:hover:bg-gray-800",
                                            )}
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
            </StaleRegion>
            {count != null && (
                <PageLinks
                    label="Pagination, below results"
                    hasNextPage={hasMorePages}
                />
            )}
        </>
    );
}
